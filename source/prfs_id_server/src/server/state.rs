use crate::{envs::ENVS, paths::PATHS, AuthOpServerError};
use chrono::{DateTime, Utc};
use colored::Colorize;
use ethers_core::{
    k256::{ecdsa::SigningKey, Secp256k1},
    types::TransactionRequest,
};
use ethers_signers::{LocalWallet, Signer, Wallet};
use git2::{Oid, Repository};
use prfs_db_interface::database2::Database2;

pub struct ServerState {
    pub db2: Database2,
    pub launch_time: DateTime<Utc>,
    pub commit_hash: Oid,
}

impl ServerState {
    pub async fn init() -> Result<ServerState, AuthOpServerError> {
        let repo = match Repository::open(&PATHS.workspace_dir) {
            Ok(repo) => repo,
            Err(e) => panic!("failed to init: {}", e),
        };

        let mut revwalk = repo.revwalk().unwrap();
        revwalk.push_head()?;
        let commit_hash = revwalk.next().unwrap().unwrap();

        let pg_endpoint = &ENVS.postgres_endpoint;
        let pg_username = &ENVS.postgres_username;
        let pg_pw = &ENVS.postgres_pw;

        let db2 = Database2::connect(pg_endpoint, pg_username, pg_pw)
            .await
            .unwrap();

        let launch_time: DateTime<Utc> = Utc::now();

        println!(
            "{} auth op server state, commit_hash: {}, launch_time: {}",
            "Initialized".green(),
            commit_hash,
            launch_time,
        );

        Ok(ServerState {
            db2,
            launch_time,
            commit_hash,
        })
    }
}
