use crate::ApiServerError;
use hyper::{body::Incoming, Request, Response};
use hyper_utils::{
    io::{parse_req, ApiHandlerResult, BytesBoxBody},
    resp::ApiResponse,
};
use prfs_common_server_state::ServerState;
use prfs_db_interface::prfs;
use prfs_entities::{
    prfs_api_entities::{
        GetPrfsCircuitByCircuitIdRequest, GetPrfsCircuitByCircuitIdResponse,
        GetPrfsCircuitsRequest, GetPrfsCircuitsResponse,
    },
    syn_entities::PrfsCircuitSyn1,
};
use std::{convert::Infallible, sync::Arc};

pub async fn get_prfs_circuits(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsCircuitsRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_circuits_syn1 = prfs::get_prfs_circuits_syn1(&pool, req.page_idx, req.page_size).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitsResponse {
        page_idx: req.page_idx,
        prfs_circuits_syn1,
    });

    return Ok(resp.into_hyper_response());
}

pub async fn get_prfs_circuit_by_circuit_id(
    req: Request<Incoming>,
    state: Arc<ServerState>,
) -> ApiHandlerResult {
    let req: GetPrfsCircuitByCircuitIdRequest = parse_req(req).await;
    let pool = &state.db2.pool;
    let prfs_circuit_syn1 = prfs::get_prfs_circuit_syn1_by_circuit_id(&pool, &req.circuit_id).await;

    let resp = ApiResponse::new_success(GetPrfsCircuitByCircuitIdResponse { prfs_circuit_syn1 });

    return Ok(resp.into_hyper_response());
}
