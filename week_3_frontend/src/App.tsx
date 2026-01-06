/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { FiRefreshCw, FiExternalLink } from "react-icons/fi";
import {
  solanaApi,
  type BalanceResponse,
  type TxSignature,
} from "./services/api";

function App() {
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [transactions, setTransactions] = useState<TxSignature[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"balance" | "transactions">(
    "balance"
  );

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter a Solana address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (activeTab === "balance") {
        const balanceData = await solanaApi.getBalance(address);
        setBalance(balanceData);
      } else {
        const txs = await solanaApi.getTransactionHistory(address);
        setTransactions(txs);
      }
    } catch (err: any) {
      setError(err.response?.data || "An error occurred");
      setBalance(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (address) {
      handleSearch();
    }
  };

  const formatLamportsToSOL = (lamports: number): string => {
    return (lamports / 1000000000).toFixed(4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shortenAddress = (addr: string): string => {
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  const shortenSignature = (sig: string): string => {
    return `${sig.slice(0, 10)}...${sig.slice(-10)}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-7">
          <div className="flex gap-2 h-[25px] items-center">
            <h1 className="text-2xl font-light tracking-tight text-white ">
              Solana Explorer
            </h1>
            <div>
              <img
                src="/src/assets/solana-sol-logo.png"
                alt="Solana Logo"
                width={25}
              />
            </div>
          </div>

          <p className="text-sm text-neutral-500 mt-5">
            Devnet balance and transaction history
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Enter address"
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:border-neutral-700 text-white placeholder:text-neutral-600 text-sm transition-colors"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-white text-black rounded-lg font-medium text-sm hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    <span>Loading</span>
                  </div>
                ) : (
                  "Search"
                )}
              </button>
              <button
                onClick={handleRefresh}
                disabled={!address || loading}
                className="px-3 py-3 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Refresh"
              >
                <FiRefreshCw className="text-sm" />
              </button>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex gap-6 border-b border-neutral-800">
            <button
              onClick={() => setActiveTab("balance")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "balance"
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Balance
              {activeTab === "balance" && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === "transactions"
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Transactions
              {activeTab === "transactions" && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white"></div>
              )}
            </button>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-neutral-800 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-neutral-500">
                  {activeTab === "balance"
                    ? "Fetching balance..."
                    : "Loading transactions..."}
                </p>
              </div>
            ) : activeTab === "balance" ? (
              balance ? (
                <div className="space-y-6">
                  <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500 mb-2">Address</p>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-white font-mono">
                            {shortenAddress(balance.address)}
                          </p>
                          <button
                            onClick={() => copyToClipboard(balance.address)}
                            className="text-neutral-500 hover:text-white transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                                strokeWidth="2"
                              />
                              <path
                                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                                strokeWidth="2"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <a
                        href={`https://solscan.io/account/${balance.address}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs transition-colors flex items-center gap-2"
                      >
                        View
                        <FiExternalLink className="text-xs" />
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-neutral-500 mb-2">
                          SOL Balance
                        </p>
                        <p className="text-3xl font-light text-white">
                          {formatLamportsToSOL(balance.lamports)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 mb-2">
                          Lamports
                        </p>
                        <p className="text-3xl font-light text-white">
                          {balance.lamports.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-neutral-500 mb-4">
                    Enter an address to get started
                  </p>
                  <button
                    onClick={() =>
                      setAddress("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin")
                    }
                    className="text-sm text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Try example address
                  </button>
                </div>
              )
            ) : transactions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-neutral-500 mb-4">
                  Showing {transactions.length} transaction
                  {transactions.length !== 1 ? "s" : ""}
                </p>
                {transactions.map((tx, index) => (
                  <div
                    key={tx.signature}
                    className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="text-xs text-neutral-600 font-mono">
                          #{index + 1}
                        </span>
                        <p className="text-sm text-white font-mono truncate">
                          {shortenSignature(tx.signature)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(tx.signature)}
                          className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                        >
                          Copy
                        </button>
                        <a
                          href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                        >
                          <FiExternalLink className="text-sm" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : balance || address ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-neutral-500">No transactions found</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-neutral-500 mb-4">
                  Enter an address to view transactions
                </p>
                <button
                  onClick={() =>
                    setAddress("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin")
                  }
                  className="text-sm text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Try example address
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-neutral-800 text-center">
          <p className="text-xs text-neutral-600">
            Connected to Solana Devnet · Backend: localhost:3000
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
