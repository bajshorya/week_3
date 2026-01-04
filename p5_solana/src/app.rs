use axum::Router;
use axum::http::Method;
use solana_client::rpc_client::RpcClient;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

use crate::{routes, state::AppState};

pub async fn run() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);

    let rpc_url = "https://solana-devnet.g.alchemy.com/v2/-lRybe07HTYCR98Xoq_r8";
    let rpc_client = Arc::new(RpcClient::new(rpc_url.to_string()));

    let state = AppState { rpc_client };

    let app = Router::new()
        .merge(routes::balance::router())
        .merge(routes::txs::router())
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
