use dotenv::dotenv;
use hyper::Server;
use prfs_api_server::{router, ApiServerError};
use prfs_db_interface::database::Database;
use routerify::RouterService;
use std::{net::SocketAddr, path::PathBuf};

#[tokio::main]
async fn main() -> Result<(), ApiServerError> {
    println!("Initializing {}...", env!("CARGO_PKG_NAME"));

    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    println!("manifest_dir: {:?}", manifest_dir);

    let load_local_assets = load_local_assets()?;

    dotenv().expect("dotenv failed");

    let pg_endpoint = std::env::var("POSTGRES_ENDPOINT").expect("POSTGRES_ENDPOINT missing");
    let pg_pw = std::env::var("POSTGRES_PW").expect("POSTGRES_PW missing");
    let db = Database::connect(pg_endpoint, pg_pw).await?;

    let router = router::make_router(db).expect("make_router fail");
    let service = RouterService::new(router).expect("router service init fail");

    let addr = SocketAddr::from(([0, 0, 0, 0], 4000));
    let server = Server::bind(&addr).serve(service);

    println!("Prfs backend is running on: {}", addr);
    if let Err(err) = server.await {
        eprintln!("Server error: {}", err);
    }

    Ok(())
}

fn load_local_assets() -> Result<(), ApiServerError> {
    // let circuits_path = prfs_circuits_

    Ok(())
}
