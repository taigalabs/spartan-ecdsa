use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyTopic {
    pub title: String,
    pub topic_id: String,
    pub channel_id: String,
    pub total_reply_count: i32,
    pub content: String,
    // pub shy_proof_id: String,
    // pub author_public_key: String,
    // pub author_sig: String,
    pub sub_channel_id: String,
    pub total_like_count: i64,

    #[ts(type = "string[]")]
    pub author_proof_identities: sqlx::types::Json<Vec<ProofIdentity>>,

    #[ts(type = "string[]")]
    pub participant_proof_identities: sqlx::types::Json<Vec<ProofIdentity>>,
    // #[ts(type = "string[]")]
    // pub shy_proof_ids: sqlx::types::Json<Vec<String>>,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ProofIdentity {
    pub shy_proof_id: String,
    pub proof_type_id: String,
    pub proof_identity_input: String,
    pub proof_public_key: String,
    pub proof_sig: String,
}

#[derive(TS, Debug, Serialize, Deserialize, Clone)]
#[ts(export)]
pub struct ShyTopicSyn1 {
    pub shy_topic: ShyTopic,
    pub img_url: String,
    pub expression: String,
    pub public_inputs: String,
    pub proof: Vec<u8>,
    pub proof_public_key: String,
    pub proof_type_id: String,
}
