mod app;
mod handlers;
mod models;
mod routes;
mod state;

#[tokio::main]
async fn main() {
    app::run().await;
}
