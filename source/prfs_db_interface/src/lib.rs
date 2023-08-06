pub mod apis;
pub mod database;
pub mod database2;
// pub mod entities;
// pub mod syn_entities;
pub mod utils;

pub use apis as db_apis;
pub use sqlx;

pub type DbInterfaceError = Box<dyn std::error::Error + Send + Sync>;
