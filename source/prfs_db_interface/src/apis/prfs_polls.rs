use crate::DbInterfaceError;
use prfs_entities::apis_entities::CreatePrfsPollRequest;
use prfs_entities::entities::{PrfsAccount, PrfsPolicyItem, PrfsPoll};
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use uuid::Uuid;

pub async fn get_prfs_polls(
    pool: &Pool<Postgres>,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<PrfsPoll>, DbInterfaceError> {
    let query = r#"
SELECT * from prfs_polls
"#;

    let rows = sqlx::query(query).fetch_all(pool).await.unwrap();

    let prfs_polls = rows
        .iter()
        .map(|row| PrfsPoll {
            poll_id: row.get("poll_id"),
            label: row.get("label"),
            plural_voting: row.get("plural_voting"),
            proof_type_id: row.get("proof_type_id"),
            author: row.get("author"),
            created_at: row.get("created_at"),
        })
        .collect();

    return Ok(prfs_polls);
}

pub async fn insert_prfs_poll(
    tx: &mut Transaction<'_, Postgres>,
    prfs_poll: &CreatePrfsPollRequest,
) -> Result<Uuid, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_polls
(poll_id, label, plural_voting, proof_type_id, author)
VALUES ($1, $2, $3, $4, $5) returning poll_id"#;

    let row = sqlx::query(query)
        .bind(&prfs_poll.poll_id)
        .bind(&prfs_poll.label)
        .bind(&prfs_poll.plural_voting)
        .bind(&prfs_poll.proof_type_id)
        .bind(&prfs_poll.author)
        .fetch_one(&mut **tx)
        .await
        .unwrap();

    let poll_id: Uuid = row.get("poll_id");

    return Ok(poll_id);
}
