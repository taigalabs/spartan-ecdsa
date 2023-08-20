use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct PrfsProofType {
    pub proof_type_id: String,

    pub label: String,
    pub author: String,
    pub desc: String,
    pub expression: String,
    pub img_url: Option<String>,

    pub circuit_id: String,
    pub driver_id: String,

    #[ts(type = "Record<number, any>")]
    pub circuit_inputs: sqlx::types::Json<HashMap<u32, CircuitInput>>,

    #[ts(type = "Record<string, any>")]
    pub driver_properties: sqlx::types::Json<HashMap<String, String>>,

    #[ts(type = "number")]
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
pub struct CircuitInput {
    pub name: String,
    pub label: String,
    pub r#type: String,
    pub desc: String,
    pub value: String,
    pub r#ref: Option<String>,
}
