use prfs_entities::sqlx::{self, Pool, Postgres, QueryBuilder, Row, Transaction};
use prfs_entities::{entities::PrfsIndex, prfs_api_entities::DatedPrfsIndex};

use crate::DbInterfaceError;

pub async fn get_prfs_indices(
    pool: &Pool<Postgres>,
    keys: &Vec<String>,
) -> Result<Vec<PrfsIndex>, DbInterfaceError> {
    let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
        r#"
SELECT *
FROM prfs_indices
WHERE key in (
"#,
    );

    let mut separated = query_builder.separated(", ");
    for key in keys.iter() {
        separated.push_bind(key);
    }
    separated.push_unseparated(") ");

    // let sql = query_builder.sql();
    // println!("sql: {:?}", sql);

    let query = query_builder.build();
    let rows = query.fetch_all(pool).await.unwrap();
    let ret = rows
        .iter()
        .map(|row| PrfsIndex {
            key: row.get("key"),
            value: row.get("value"),
            serial_no: row.get("serial_no"),
        })
        .collect();

    return Ok(ret);
}

pub async fn get_least_recent_prfs_index(
    pool: &Pool<Postgres>,
    prfs_indices: &Vec<String>,
) -> Result<Vec<DatedPrfsIndex>, DbInterfaceError> {
    let mut query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
        r#"
SELECT prfs_indices.*, key as key2
FROM (values
"#,
    );
    let mut separated = query_builder.separated(", ");

    for idx in prfs_indices.iter() {
        separated.push(format!("('{}')", idx));
    }
    separated.push_unseparated(") ");
    separated.push_unseparated(
        r#"
v(key) LEFT JOIN
prfs_indices
USING (key)
ORDER BY updated_at DESC
"#,
    );

    // let sql = query_builder.sql();
    // println!("sql: {:?}", sql);

    let query = query_builder.build();
    let rows = query.fetch_all(pool).await.unwrap();
    let ret = rows
        .iter()
        .map(|row| DatedPrfsIndex {
            key: row.get("key"),
            value: row.get("value"),
            serial_no: row.get("serial_no"),
            updated_at: row.get("updated_at"),
            key2: row.get("key2"),
        })
        .collect();

    println!("rows: {:?}", ret);

    return Ok(ret);
}

pub async fn upsert_prfs_index(
    tx: &mut Transaction<'_, Postgres>,
    key: &String,
    value: &String,
    serial_no: &String,
) -> Result<String, DbInterfaceError> {
    let query = r#"
INSERT INTO prfs_indices
(key, value, serial_no)
VALUES ($1, $2, $3)
ON CONFLICT (key) DO UPDATE SET (
key, value, updated_at
) = (
excluded.key, excluded.value, now()
)
RETURNING key"#;

    let row = sqlx::query(query)
        .bind(&key)
        .bind(&value)
        .bind(&serial_no)
        .fetch_one(&mut **tx)
        .await?;

    let key: String = row.get("key");

    return Ok(key);
}
