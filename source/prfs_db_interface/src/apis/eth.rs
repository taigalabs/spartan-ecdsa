use crate::{
    database::Database,
    models::{EthAccount, PrfsTreeNode, ProofType},
    DbInterfaceError,
};
use rust_decimal::Decimal;
use std::collections::BTreeMap;
use tokio_postgres::Row;

impl Database {
    pub async fn get_accounts(
        &self,
        where_clause: &str,
    ) -> Result<Vec<EthAccount>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} where {}",
            EthAccount::table_name(),
            where_clause
        );
        // println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        let accounts: Vec<EthAccount> = rows
            .iter()
            .map(|r| {
                let addr: String = r.try_get("addr").expect("addr should be present");
                let wei: Decimal = r.try_get("wei").expect("wei should be present");

                EthAccount { addr, wei }
            })
            .collect();

        Ok(accounts)
    }

    pub async fn get_eth_tree_nodes(
        &self,
        where_clause: &str,
    ) -> Result<Vec<PrfsTreeNode>, DbInterfaceError> {
        let stmt = format!(
            "SELECT * from {} where {}",
            PrfsTreeNode::table_name(),
            where_clause
        );
        // println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

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

    pub async fn get_proof_types(&self) -> Result<Vec<Row>, DbInterfaceError> {
        let stmt = format!("SELECT * from {}", ProofType::table_name(),);
        // println!("stmt: {}", stmt);

        let rows = match self.pg_client.query(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("account retrieval failed, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        Ok(rows)
    }

    pub async fn insert_accounts(
        &self,
        balances: BTreeMap<String, EthAccount>,
        update_on_conflict: bool,
    ) -> Result<u64, DbInterfaceError> {
        let mut values = Vec::with_capacity(balances.len());
        for (_, acc) in balances {
            let val = format!("('{}', {})", acc.addr, acc.wei);
            values.push(val);
        }

        let stmt = if update_on_conflict {
            format!(
                "INSERT INTO {} (addr, wei) VALUES {} ON CONFLICT(addr) {}",
                EthAccount::table_name(),
                values.join(","),
                "DO UPDATE SET wei = excluded.wei, updated_at = now()",
            )
        } else {
            format!(
                "INSERT INTO {} (addr, wei) VALUES {} ON CONFLICT DO NOTHING",
                EthAccount::table_name(),
                values.join(",")
            )
        };
        // println!("stmt: {}", stmt);

        let rows_updated = match self.pg_client.execute(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("Error executing stmt, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        Ok(rows_updated)
    }

    pub async fn insert_eth_tree_nodes(
        &self,
        nodes: &Vec<PrfsTreeNode>,
        update_on_conflict: bool,
    ) -> Result<u64, DbInterfaceError> {
        let mut values = Vec::with_capacity(nodes.len());

        for n in nodes {
            let val = format!("({}, {}, '{}', '{}')", n.pos_w, n.pos_h, n.val, n.set_id);
            values.push(val);
        }

        let stmt = if update_on_conflict {
            format!(
                "INSERT INTO {} (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT \
                    (pos_w, pos_h, set_id) {}",
                PrfsTreeNode::table_name(),
                values.join(","),
                "DO UPDATE SET val = excluded.val, updated_at = now()",
            )
        } else {
            format!(
                "INSERT INTO {} (pos_w, pos_h, val, set_id) VALUES {} ON CONFLICT DO NOTHING",
                PrfsTreeNode::table_name(),
                values.join(","),
            )
        };
        // println!("stmt: {}", stmt);

        let rows_updated = match self.pg_client.execute(&stmt, &[]).await {
            Ok(r) => r,
            Err(err) => {
                tracing::error!("Error executing stmt, err: {}, stmt: {}", err, stmt);

                return Err(err.into());
            }
        };

        Ok(rows_updated)
    }
}
