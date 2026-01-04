use crate::{handlers, state::AppState};
use axum::{Router, routing::get};

pub fn router() -> Router<AppState> {
    Router::new().route("/txs/{address}", get(handlers::txs::get_tx_history))
}
