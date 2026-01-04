use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use solana_sdk::pubkey::Pubkey;

use crate::{models::responses::BalanceResponse, state::AppState};

pub async fn get_balance(
    Path(addr): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    let key = match addr.parse::<Pubkey>() {
        Ok(k) => k,
        Err(_) => {
            return (StatusCode::BAD_REQUEST, Json("Invalid address")).into_response();
        }
    };

    match state.rpc_client.get_balance(&key) {
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
