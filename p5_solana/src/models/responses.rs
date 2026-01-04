use serde::Serialize;

#[derive(Serialize)]
pub struct BalanceResponse {
    pub address: String,
    pub lamports: u64,
}

#[derive(Serialize)]
pub struct TxSignature {
    pub signature: String,
}
