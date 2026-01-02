use axum::{Router, routing::get};
mod vehicle;
use vehicle::{vehicle_get, vehicle_post};
#[tokio::main]
async fn main() {
    //axum router
    let router01 = Router::new().route("/vehicle", get(vehicle_get).post(vehicle_post));

    //IP and port listner
    let address = "0.0.0.0:8000";
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();

    //axum serve and launch web server
    axum::serve(listener, router01).await.unwrap();
}
