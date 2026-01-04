use axum::{
    Json,
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use solana_sdk::pubkey::Pubkey;

use crate::{models::responses::TxSignature, state::AppState};

pub async fn get_tx_history(
    Path(addr): Path<String>,
    State(state): State<AppState>,
) -> impl IntoResponse {
    let key = match addr.parse::<Pubkey>() {
        Ok(k) => k,
        Err(_) => {
            return (StatusCode::BAD_REQUEST, Json("Invalid address")).into_response();
        }
    };

    let sig_infos = match state.rpc_client.get_signatures_for_address(&key) {
        Ok(s) => s,
        Err(e) => {
            return (StatusCode::INTERNAL_SERVER_ERROR, Json(e.to_string())).into_response();
        }
    };

    let sigs: Vec<TxSignature> = sig_infos
        .into_iter()
        .map(|info| TxSignature {
            signature: info.signature.to_string(),
        })
        .collect();

    (StatusCode::OK, Json(sigs)).into_response()
}
