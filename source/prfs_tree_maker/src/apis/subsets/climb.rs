use super::json::{self, ProofTypeJson};
use crate::TreeMakerError;
use prfs_db_interface::{database::Database, models::PrfsTreeNode};
use rust_decimal::Decimal;

pub async fn climb() -> Result<(), TreeMakerError> {
    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT")?;
    let pg_pw = std::env::var("POSTGRES_PW")?;
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let subset_filename = std::env::var("SUBSET_FILENAME")?;
    let subset_json = json::read_subset_file(subset_filename)?;

    climb_subset(&db, subset_json).await?;

    Ok(())
}

async fn climb_subset(db: &Database, proof_type_json: ProofTypeJson) -> Result<(), TreeMakerError> {
    let set_id = proof_type_json.set_id.to_string();
    let depth = proof_type_json.tree_depth as usize;

    println!("climb_subset, set_id: {}", set_id);

    let where_clause = format!("set_id='{}' order by pos_w asc", set_id);

    let leaves = db.get_eth_tree_nodes(&where_clause).await?;

    let leaves: Vec<[u8; 32]> = leaves
        .iter()
        .map(|leaf| {
            let b = prfs_crypto::convert_hex_into_32bytes(&leaf.val).unwrap();
            b
        })
        .collect();

    if depth < 2 {
        return Err(format!("Cannot climb if depth is less than 2, set_id: {}", set_id).into());
    }

    if leaves.len() < 1 {
        return Err(format!("Cannot climb if there is no leaf, set_id: {}", set_id).into());
    }

    let mut children = leaves.to_vec();

    for d in 0..depth {
        let parent = match prfs_crypto::calc_parent_nodes(&children) {
            Ok(p) => p,
            Err(err) => return Err(format!("calc parent err: {}, d: {}", err, d).into()),
        };

        // println!("parent: {:?}", parent);

        let mut parent_nodes = vec![];
        for (idx, node) in parent.iter().enumerate() {
            // println!("node: {:?}, idx: {}", node, idx);
            let val = prfs_crypto::convert_32bytes_into_decimal_string(node).unwrap();

            let n = PrfsTreeNode {
                pos_w: Decimal::from(idx),
                pos_h: (d + 1) as i32,
                val,
                set_id: set_id.to_string(),
            };

            parent_nodes.push(n);
        }

        println!("d: {}, parent_nodes len: {:?}", d, parent_nodes.len());

        db.insert_eth_tree_nodes(&parent_nodes, false).await?;
        children = parent;
        // break;
    }

    Ok(())
}
