use serde::{Deserialize, Serialize};
use sqlx::Type;
use ts_rs::TS;

use super::{RangeData, SpartanMerkleProof};

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1Inputs {
    sigLower: i64,
    sigUpper: i64,
    leaf: i64,
    assetSize: i64,
    assetSizeGreaterEqThan: i64,
    assetSizeLessThan: i64,
    merkleProof: SpartanMerkleProof,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[allow(non_snake_case)]
#[ts(export)]
pub struct MerkleSigPosRangeV1Data {
    prfs_set_id: String,
    range_data: RangeData,
}
