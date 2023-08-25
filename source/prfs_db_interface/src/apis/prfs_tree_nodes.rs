use crate::{database2::Database2, DbInterfaceError};
use prfs_entities::entities::PrfsTreeNode;
use prfs_entities::sqlx::{self, Pool, Postgres, Row, Transaction};
use uuid::Uuid;

pub async fn get_prfs_tree_nodes(
    pool: &Pool<Postgres>,
    where_clause: &str,
) -> Result<Vec<PrfsTreeNode>, DbInterfaceError> {
    let query = format!("SELECT * from prfs_tree_nodes nodes {}", where_clause);
    println!("query: {}", query);

    let rows = sqlx::query(&query).fetch_all(pool).await.unwrap();

    let nodes: Vec<PrfsTreeNode> = rows
        .iter()
        .map(|n| {
            let pos_w = n.try_get("pos_w").expect("pos_w should exist");
            let pos_h = n.try_get("pos_h").expect("pos_h should exist");
            let val = n.try_get("val").expect("val should exist");
            let set_id = n.try_get("set_id").expect("set_id should exist");

            PrfsTreeNode {
                pos_w,
                pos_h,
                val,
                set_id,
            }
        })
        .collect();

    Ok(nodes)
}

pub async fn get_prfs_tree_leaf_nodes_by_set_id(
    pool: &Pool<Postgres>,
    set_id: &Uuid,
    page_idx: i32,
    page_size: i32,
) -> Result<Vec<PrfsTreeNode>, DbInterfaceError> {
    let query = r#"
SELECT * from prfs_tree_nodes nodes where set_id=$1 and pos_h=0 
ORDER BY pos_w ASC
OFFSET $2
LIMIT $3
"#;

    println!("query: {}", query);
    let offset = page_idx * page_size;

    let rows = sqlx::query(&query)
        .bind(&set_id)
        .bind(&offset)
        .bind(&page_size)
        .fetch_all(pool)
        .await
        .unwrap();

    let nodes: Vec<PrfsTreeNode> = rows
        .iter()
        .map(|n| {
            let pos_w = n.try_get("pos_w").expect("pos_w should exist");
            let pos_h = n.try_get("pos_h").expect("pos_h should exist");
            let val = n.try_get("val").expect("val should exist");
            let set_id = n.try_get("set_id").expect("set_id should exist");

            PrfsTreeNode {
                pos_w,
                pos_h,
                val,
                set_id,
            }
        })
        .collect();

    Ok(nodes)
}

pub async fn get_prfs_tree_root(
    pool: &Pool<Postgres>,
    set_id: &String,
) -> Result<PrfsTreeNode, DbInterfaceError> {
    let query = format!("SELECT * from prfs_tree_nodes where set_id=$1 and pos_h=31 and pos_w=0",);
    // println!("query: {}", query);

    let row = sqlx::query(&query)
        .bind(&set_id)
        .fetch_one(pool)
        .await
        .unwrap();

    let pos_w = row.try_get("pos_w").expect("pos_w should exist");
    let pos_h = row.try_get("pos_h").expect("pos_h should exist");
    let val = row.try_get("val").expect("val should exist");
    let set_id = row.try_get("set_id").expect("set_id should exist");

    let n = PrfsTreeNode {
        pos_w,
        pos_h,
        val,
        set_id,
        // set_id2,
    };

    Ok(n)
}

pub async fn insert_prfs_tree_nodes(
    tx: &mut Transaction<'_, Postgres>,
    nodes: &[PrfsTreeNode],
    update_on_conflict: bool,
) -> Result<u64, DbInterfaceError> {
    let mut values = Vec::with_capacity(nodes.len());

    for n in nodes {
        let val = format!("({}, {}, '{}', '{}')", n.pos_w, n.pos_h, n.val, n.set_id);
        values.push(val);
    }

    let query = if update_on_conflict {
        format!(
            "INSERT INTO prfs_tree_nodes (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT \
                    (pos_w, pos_h, set_id) {}",
            values.join(","),
            "DO UPDATE SET val = excluded.val, updated_at = now()",
        )
    } else {
        format!(
            "INSERT INTO prfs_tree_nodes (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT DO NOTHING",
            values.join(","),
        )
    };

    let result = sqlx::query(&query).execute(&mut **tx).await.unwrap();

    Ok(result.rows_affected())
}
