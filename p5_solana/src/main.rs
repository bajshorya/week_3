use axum::{
    Json, Router,
    extract::Path,
    http::{Method, StatusCode},
    response::IntoResponse,
    routing::get,
};
use serde::Serialize;
use solana_client::rpc_client::RpcClient;
use solana_sdk::pubkey::Pubkey;
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};

#[derive(Serialize)]
struct BalanceResponse {
    address: String,
    lamports: u64,
}
#[derive(Serialize)]
struct TxSignature {
    signature: String,
}
#[tokio::main]
async fn main() {
    let _cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);
    let rpc_url = "https://solana-devnet.g.alchemy.com/v2/JdgL5NilRGmk77B2AI58gSbXf1kZJZHi";
    let rpc_client = Arc::new(RpcClient::new(rpc_url.to_string()));

    let app = Router::new()
        .route(
            "/balance/{address}",
            get({
                let client = Arc::clone(&rpc_client);
                move |Path(addr): Path<String>| {
                    let client = Arc::clone(&client);
                    async move { get_balance_handler(addr, client).await }
                }
            }),
        )
        .route(
            "/txs/{address}",
            get({
                let client = Arc::clone(&rpc_client);
                move |Path(addr): Path<String>| {
                    let client = Arc::clone(&client);
                    async move { get_tx_history_handler(addr, client).await }
                }
            }),
        )
        .layer(_cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_balance_handler(addr: String, client: Arc<RpcClient>) -> impl IntoResponse {
    let key = match addr.parse::<Pubkey>() {
        Ok(v) => v,
        Err(_) => {
            return (StatusCode::BAD_REQUEST, Json("Invalid address".to_string())).into_response();
        }
    };

    match client.get_balance(&key) {
        Ok(lamports) => {
            let res = BalanceResponse {
                address: addr,
                lamports,
            };
            (StatusCode::OK, Json(res)).into_response()
        }
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())).into_response(),
    }
}

async fn get_tx_history_handler(addr: String, client: Arc<RpcClient>) -> impl IntoResponse {
    let key = match addr.parse::<Pubkey>() {
        Ok(k) => k,
        Err(_) => {
            return (StatusCode::BAD_REQUEST, Json("Invalid address".to_string())).into_response();
        }
    };

    let sig_infos = match client.get_signatures_for_address(&key) {
        Ok(sigs) => sigs,
        Err(e) => return (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())).into_response(),
    };

    let sigs: Vec<TxSignature> = sig_infos
        .into_iter()
        .map(|info| TxSignature {
            signature: info.signature.to_string(),
        })
        .collect();

    (StatusCode::OK, Json(sigs)).into_response()
}
