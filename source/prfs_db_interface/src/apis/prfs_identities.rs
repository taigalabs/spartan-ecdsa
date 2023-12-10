use crate::DbInterfaceError;
use prfs_entities::entities::PrfsIdentity;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};

pub async fn get_prfs_identity_by_id(
    pool: &Pool<Postgres>,
    identity_id: &String,
) -> Result<PrfsIdentity, DbInterfaceError> {
    let query = "SELECT * from prfs_identities where identity_id=$1";

    let row = sqlx::query(query)
        .bind(&identity_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let prfs_identity = PrfsIdentity {
        identity_id: row.get("identity_id"),
        avatar_color: row.get("avatar_color"),
    };

    Ok(prfs_identity)
}

pub async fn insert_prfs_identity(
    tx: &mut Transaction<'_, Postgres>,
    prfs_identity: &PrfsIdentity,
) -> Result<String, DbInterfaceError> {
    let query = "INSERT INTO prfs_identity \
            (identity_id, avatar_color) \
            VALUES ($1, $2) returning identity_id";

    let row = sqlx::query(query)
        .bind(&prfs_identity.identity_id)
        .bind(&prfs_identity.avatar_color)
        .fetch_one(&mut **tx)
        .await?;

    let identity_id: String = row.get("identity_id");

    return Ok(identity_id);
}
