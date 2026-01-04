use solana_client::rpc_client::RpcClient;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub rpc_client: Arc<RpcClient>,
}
