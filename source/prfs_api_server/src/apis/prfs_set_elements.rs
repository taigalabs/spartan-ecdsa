use axum::{
    extract::{MatchedPath, Request, State},
    handler::HandlerWithoutStateExt,
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use git2::Status;
use hyper::body::Incoming;
use prfs_axum_lib::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
    ApiHandleError,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::prfs_api::{
    GetPrfsSetElementRequest, GetPrfsSetElementResponse, GetPrfsSetElementsRequest,
    GetPrfsSetElementsResponse, ImportPrfsSetElementsRequest, ImportPrfsSetElementsResponse,
};
use std::sync::Arc;

use crate::error_codes::API_ERROR_CODES;

const LIMIT: i32 = 20;
const PRFS_ATTESTATION: &str = "prfs_attestation";
const CRYPTO_ASSET_SIZE_ATSTS: &str = "crypto_asset_size_atsts";

pub async fn import_prfs_set_elements(
    // req: Request<Incoming>,
    // state: Arc<ServerState>,
    State(state): State<Arc<ServerState>>,
    Json(input): Json<ImportPrfsSetElementsRequest>,
) -> (StatusCode, Json<ApiResponse<ImportPrfsSetElementsResponse>>) {
    // let req: ImportPrfsSetElementsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let mut tx = pool.begin().await.unwrap();

    if input.src_type != PRFS_ATTESTATION {
        let resp = ApiResponse::new_error(
            &API_ERROR_CODES.UNKNOWN_ERROR,
            "Currently only PRFS_ATTESTATION is importable".into(),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    if input.src_id != CRYPTO_ASSET_SIZE_ATSTS {
        let resp = ApiResponse::new_error(
            &API_ERROR_CODES.UNKNOWN_ERROR,
            "Currently only CRYPTO_ASSET_SIZE_ATSTS is importable".into(),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    prfs::delete_prfs_set_elements(&mut tx, &input.dest_set_id)
        .await
        .unwrap();

    let atsts = prfs::get_prfs_crypto_asset_size_atsts(&pool, 0, 50000)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))
        .unwrap();

    if atsts.len() > 65536 {
        let resp = ApiResponse::new_error(
            &API_ERROR_CODES.UNKNOWN_ERROR,
            "Currently we can produce upto 65536 items".into(),
        );
        return (StatusCode::BAD_REQUEST, Json(resp));
    }

    let rows_affected =
        prfs::insert_asset_atsts_as_prfs_set_elements(&mut tx, atsts, &input.dest_set_id)
            .await
            .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))
            .unwrap();
    tx.commit().await.unwrap();

    let resp = ApiResponse::new_success(ImportPrfsSetElementsResponse {
        set_id: input.dest_set_id.to_string(),
        rows_affected,
    });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_set_elements(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetElementsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetElementsResponse>>) {
    let pool = &state.db2.pool;

    let rows = prfs::get_prfs_set_elements(&pool, &input.set_id, input.offset, LIMIT)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))
        .unwrap();

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsSetElementsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}

pub async fn get_prfs_set_element(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsSetElementRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsSetElementResponse>>) {
    let pool = &state.db2.pool;

    let prfs_set_element = prfs::get_prfs_set_element(&pool, &input.set_id, &input.label)
        .await
        .map_err(|err| ApiHandleError::from(&API_ERROR_CODES.UNKNOWN_ERROR, err))
        .unwrap();

    let resp = ApiResponse::new_success(GetPrfsSetElementResponse { prfs_set_element });
    return (StatusCode::OK, Json(resp));
}
