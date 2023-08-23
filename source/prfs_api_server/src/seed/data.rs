use crate::seed::local::{
    load_circuit_drivers, load_circuit_input_types, load_circuit_types, load_circuits,
};
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use prfs_db_interface::database2::Database2;
use prfs_db_interface::db_apis;
use prfs_entities::entities::PrfsProofType;
use prfs_entities::sqlx::types::Json;
use std::collections::HashMap;

pub async fn upload(db: Database2) {
    let pool = &db.pool;
    let mut tx = pool.begin().await.unwrap();

    let circuit_drivers = load_circuit_drivers();
    println!("circuit_drivers: {:#?}", circuit_drivers);

    for circuit_driver in circuit_drivers.values() {
        let circuit_driver_id = db_apis::insert_prfs_circuit_driver(&mut tx, circuit_driver).await;
        println!("Inserted circuit_driver, id: {}", circuit_driver_id);
    }

    // let circuit_types = load_circuit_types();
    // println!("circuit_types: {:#?}", circuit_types);

    // let circuit_input_types = load_circuit_input_types();
    // println!("circuit_input_types: {:#?}", circuit_input_types);

    // let circuits = load_circuits();
    // println!("circuits: {:#?}", circuits);

    tx.commit().await.unwrap();
}
