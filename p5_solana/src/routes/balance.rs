use crate::{handlers, state::AppState};
use axum::{Router, routing::get};

pub fn router() -> Router<AppState> {
    Router::new().route("/balance/{address}", get(handlers::balance::get_balance))
}
