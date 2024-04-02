use prfs_atst_api_error_codes::PRFS_ATST_API_ERROR_CODES;
use prfs_axum_lib::axum::{extract::State, http::StatusCode, Json};
use prfs_axum_lib::resp::ApiResponse;
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{GetPrfsAtstGroupsRequest, GetPrfsAtstGroupsResponse, PrfsAtstTypeId};
use std::sync::Arc;

use crate::envs::ENVS;

const LIMIT: i32 = 20;

pub async fn get_prfs_atst_groups(
    State(state): State<Arc<ServerState>>,
    Json(input): Json<GetPrfsAtstGroupsRequest>,
) -> (StatusCode, Json<ApiResponse<GetPrfsAtstGroupsResponse>>) {
    let pool = &state.db2.pool;

    let rows = match prfs::get_prfs_atst_groups(&pool, input.offset, LIMIT).await {
        Ok(r) => r,
        Err(err) => {
            let resp =
                ApiResponse::new_error(&PRFS_ATST_API_ERROR_CODES.UNKNOWN_ERROR, err.to_string());
            return (StatusCode::BAD_REQUEST, Json(resp));
        }
    };

    let next_offset = if rows.len() < LIMIT.try_into().unwrap() {
        None
    } else {
        Some(input.offset + LIMIT)
    };

    let resp = ApiResponse::new_success(GetPrfsAtstGroupsResponse { rows, next_offset });
    return (StatusCode::OK, Json(resp));
}
