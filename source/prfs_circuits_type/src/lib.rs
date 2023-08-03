use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[allow(non_camel_case_types)]
pub enum PublicInputKind {
    PROVER_GENERATED,
    PRFS_SET,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicInput {
    pub r#type: PublicInputKind,
    pub label: String,
    pub desc: String,
}

pub type PublicInputInstance = HashMap<u32, PublicInputInstanceEntry>;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PublicInputInstanceEntry {
    pub r#type: PublicInputKind,
    pub label: String,
    pub desc: String,
    pub value: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub r#ref: Option<String>,
}
