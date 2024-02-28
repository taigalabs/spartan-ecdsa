use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::entities::{ShyPost, ShyPostProof};

use crate::DbInterfaceError;

// pub async fn get_shy_posts(
//     pool: &Pool<Postgres>,
//     channel_id: &String,
//     offset: i32,
//     limit: i32,
// ) -> Result<Vec<ShyPost>, DbInterfaceError> {
//     let query = r#"
// SELECT *
// FROM shy_posts
// WHERE channel_id=$1
// ORDER BY updated_at DESC
// OFFSET $2
// LIMIT $3
// "#;

//     let rows = sqlx::query(&query)
//         .bind(channel_id)
//         .bind(offset)
//         .bind(limit)
//         .fetch_all(pool)
//         .await
//         .unwrap();

//     let shy_posts: Vec<ShyPost> = rows
//         .iter()
//         .map(|row| ShyPost {
//             post_id: row.get("post_id"),
//             content: row.get("content"),
//             channel_id: row.get("channel_id"),
//         })
//         .collect();

//     Ok(shy_posts)
// }

pub async fn insert_shy_post_proof(
    tx: &mut Transaction<'_, Postgres>,
    shy_post_proof: &ShyPostProof,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO shy_post_proofs
(shy_post_proof_id, proof, public_inputs, public_key)
VALUES ($1, $2, $3, $4)
RETURNING shy_post_proof_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_post_proof.shy_post_proof_id)
        .bind(&shy_post_proof.proof)
        .bind(&shy_post_proof.public_inputs)
        .bind(&shy_post_proof.public_key)
        .fetch_one(&mut **tx)
        .await?;

    let proof_id: String = row.try_get("shy_post_proof_id")?;
    Ok(proof_id)
}
