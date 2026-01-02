import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export interface BalanceResponse {
  address: string;
  lamports: number;
}

export interface TxSignature {
  signature: string;
}

class SolanaApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  async getBalance(address: string): Promise<BalanceResponse> {
    const response = await this.api.get<BalanceResponse>(`/balance/${address}`);
    return response.data;
  }

  async getTransactionHistory(address: string): Promise<TxSignature[]> {
    const response = await this.api.get<TxSignature[]>(`/txs/${address}`);
    return response.data;
  }
}

export const solanaApi = new SolanaApiService();
