use prfs_db_driver::sqlx::{self, Pool, Postgres, Row, Transaction};
use shy_entities::{DateTimed, ShyComment, ShyCommentWithProofs};

use crate::ShyDbInterfaceError;

pub async fn insert_shy_comment(
    tx: &mut Transaction<'_, Postgres>,
    shy_comment: &ShyComment,
) -> Result<String, ShyDbInterfaceError> {
    let query = r#"
INSERT INTO shy_comments
(topic_id, content, comment_id, channel_id, shy_proof_id, author_public_key, author_sig,
author_proof_ids)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING comment_id
"#;

    let row = sqlx::query(query)
        .bind(&shy_comment.topic_id)
        .bind(&shy_comment.content)
        .bind(&shy_comment.comment_id)
        .bind(&shy_comment.channel_id)
        .bind(&shy_comment.author_public_key)
        .bind(&shy_comment.author_sig)
        .bind(&shy_comment.author_proof_ids)
        .fetch_one(&mut **tx)
        .await?;

    let comment_id: String = row
        .try_get("comment_id")
        .map_err(|err| format!("Failed to insert shy comment, err: {}", err))?;

    Ok(comment_id)
}

pub async fn get_shy_comments_with_proofs_by_topic_id(
    pool: &Pool<Postgres>,
    topic_id: &String,
    offset: i32,
    limit: i32,
) -> Result<Vec<DateTimed<ShyCommentWithProofs>>, ShyDbInterfaceError> {
    let query = r#"
SELECT p.*, f.*, pt.*
FROM shy_comments p
INNER JOIN shy_proofs f ON f.shy_proof_id = p.shy_proof_id
INNER JOIN prfs_proof_types pt ON pt.proof_type_id = f.proof_type_id
WHERE p.topic_id=$1
ORDER BY p.updated_at ASC
OFFSET $2
LIMIT $3
"#;

    let rows = sqlx::query(&query)
        .bind(topic_id)
        .bind(offset)
        .bind(limit)
        .fetch_all(pool)
        .await?;

    let shy_comments = rows
        .iter()
        .map(|row| {
            let comment_ = ShyCommentWithProofs {
                shy_comment: ShyComment {
                    comment_id: row.try_get("comment_id")?,
                    topic_id: row.try_get("topic_id")?,
                    content: row.try_get("content")?,
                    channel_id: row.try_get("channel_id")?,
                    // shy_proof_id: row.try_get("shy_proof_id")?,
                    author_public_key: row.try_get("author_public_key")?,
                    author_sig: row.try_get("author_sig")?,
                    author_proof_ids: row.try_get("author_proof_ids")?,
                },
                img_url: row.try_get("img_url")?,
                expression: row.try_get("expression")?,
                public_inputs: row.try_get("public_inputs")?,
                proof: row.try_get("proof")?,
                proof_public_key: row.try_get("public_key")?,
                proof_type_id: row.try_get("proof_type_id")?,
            };

            let comment = DateTimed {
                inner: comment_,
                created_at: row.try_get("created_at")?,
                updated_at: row.try_get("updated_at")?,
            };

            return Ok(comment);
        })
        .collect::<Result<Vec<DateTimed<ShyCommentWithProofs>>, ShyDbInterfaceError>>()?;

    Ok(shy_comments)
}
