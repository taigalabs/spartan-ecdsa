use crate::State;
// use eth_types::sign_types::SignData;
use ff::PrimeField;
// use halo2_gadgets::poseidon::{
//     self,
//     primitives::{ConstantLength, P128Pow5T3},
// };
// use halo2_gadgets::utilities::i2lebsp;
// use halo2_proofs::halo2curves::pasta::{Fp as PastaFp, Fq as PastaFq};
// use halo2_proofs::halo2curves::secp256k1::{Fp as SecFp, Fq as SecFq, Secp256k1Affine};
// use halo2_proofs::halo2curves::CurveAffine;
use hyper::{body, header, Body, Request, Response};
// use prfs_proofs::asset_proof_1;
// use prfs_proofs::asset_proof_1::constants::{POS_RATE, POS_WIDTH};
// use prfs_proofs::{pk_bytes_le, pk_bytes_swap_endianness};
use routerify::prelude::*;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct GetProofTypesRequest {}

#[derive(Serialize, Deserialize, Debug)]
struct GetProofTypeResponse {
    proof_types: Vec<ProofType>,
}

#[derive(Serialize, Deserialize, Debug)]
struct ProofType {
    label: String,
    desc: String,
}

// pub async fn get_proof_types(req: Request<Body>) -> Result<Response<Body>, Infallible> {
//     println!("get proof types");

//     let state = req.data::<State>().unwrap();
//     let db = state.db.clone();

//     let bytes = body::to_bytes(req.into_body()).await.unwrap();
//     let body_str = String::from_utf8(bytes.to_vec()).unwrap();
//     let get_proof_types_req = serde_json::from_str::<GetProofTypesRequest>(&body_str).unwrap();

//     println!("get_proof_types_req: {:?}", get_proof_types_req);

//     let rows = db.get_proof_types().await.expect("get nodes fail");
//     println!("rows: {:?}", rows);

//     let proof_types: Vec<ProofType> = rows
//         .iter()
//         .map(|r| {
//             let desc: String = r.try_get("desc").unwrap();
//             let label: String = r.try_get("label").unwrap();

//             ProofType { desc, label }
//         })
//         .collect();

//     println!("proof_types: {:?}", proof_types);

//     let resp = GetProofTypeResponse { proof_types };

//     let data = serde_json::to_string(&resp).unwrap();

//     let res = Response::builder()
//         .header(header::CONTENT_TYPE, "application/json")
//         .body(Body::from(data))
//         .unwrap();

//     Ok(res)
// }
