import { useState } from "react";
import { FiSearch, FiRefreshCw, FiExternalLink } from "react-icons/fi";
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div
      className="h-screen overflow-hidden text-white relative"
      style={{
        backgroundImage: "url('src/assets/bg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-900/40 to-slate-900/60"></div>

      <div className="relative z-10 h-full">
        <div className="container mx-auto h-full flex flex-col px-4 py-6">
          <header className="text-center mb-6 flex-shrink-0">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent tracking-tight">
              Solana Explorer
            </h1>
            <p className="text-slate-200 text-sm">
              Check balances and transaction history on Solana Devnet
            </p>
          </header>

          <div className="flex-1 max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-300 text-sm" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Solana address"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/30 text-white placeholder:text-slate-300/70 text-sm backdrop-blur-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-2.5 bg-gradient-to-r from-cyan-500/90 to-purple-500/90 hover:from-cyan-600/90 hover:to-purple-600/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                        Search
                      </>
                    ) : (
                      <>
                        <FiSearch className="text-sm" /> Search
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRefresh}
                    disabled={!address || loading}
                    className="px-3 py-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all duration-200 border border-white/20 text-sm"
                    title="Refresh"
                  >
                    <FiRefreshCw className="text-sm" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-3 p-2.5 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-xs backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex border-b border-white/10 flex-shrink-0">
              <button
                onClick={() => setActiveTab("balance")}
                className={`flex-1 py-3 text-center font-medium transition-all duration-300 text-sm ${
                  activeTab === "balance"
                    ? "text-cyan-300 border-b-2 border-cyan-300 bg-gradient-to-t from-cyan-500/5 to-transparent"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>💰</span>
                  Balance
                </div>
              </button>
              <button
                onClick={() => setActiveTab("transactions")}
                className={`flex-1 py-3 text-center font-medium transition-all duration-300 text-sm ${
                  activeTab === "transactions"
                    ? "text-cyan-300 border-b-2 border-cyan-300 bg-gradient-to-t from-cyan-500/5 to-transparent"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span>📜</span>
                  Transactions
                </div>
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-4">
              {activeTab === "balance" ? (
                <div className="h-full">
                  {balance ? (
                    <div className="h-full flex flex-col space-y-4">
                      <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-xl border border-white/15 flex-shrink-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-300 mb-1.5 font-medium">
                              Address
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-sm bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate">
                                {shortenAddress(balance.address)}
                              </p>
                              <button
                                onClick={() => copyToClipboard(balance.address)}
                                className="p-1.5 bg-white/10 hover:bg-white/15 rounded transition-colors border border-white/20 flex-shrink-0"
                                title="Copy address"
                              >
                                📋
                              </button>
                            </div>
                          </div>
                          <a
                            href={`https://solscan.io/account/${balance.address}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 md:mt-0 px-3 py-1.5 bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 hover:from-cyan-500 hover:to-cyan-600 rounded-lg font-medium transition-all duration-200 text-xs flex items-center gap-1.5 flex-shrink-0"
                          >
                            <span>Solscan</span>
                            <FiExternalLink className="text-xs" />
                          </a>
                        </div>
                      </div>

                      {/* Balance Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <div className="p-4 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 backdrop-blur-sm rounded-xl border border-white/15 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <span className="text-sm">🔢</span>
                            </div>
                            <p className="text-slate-300 font-medium text-sm">
                              Lamports
                            </p>
                          </div>
                          <p className="text-2xl font-bold font-mono bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent flex-1 flex items-center">
                            {balance.lamports.toLocaleString()}
                          </p>
                          <div className="mt-2 pt-2 border-t border-white/10 text-xs text-slate-400">
                            Raw token units
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 backdrop-blur-sm rounded-xl border border-white/15 flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                              <span className="text-sm">💎</span>
                            </div>
                            <p className="text-slate-300 font-medium text-sm">
                              SOL Balance
                            </p>
                          </div>
                          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent flex-1 flex items-center">
                            {formatLamportsToSOL(balance.lamports)}{" "}
                            <span className="text-lg ml-1">SOL</span>
                          </p>
                          <div className="mt-2 pt-2 border-t border-white/10 text-xs text-slate-400">
                            1 SOL = 1B Lamports
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-8">
                      <div className="text-5xl mb-4 text-slate-500/50">👆</div>
                      <p className="text-lg text-slate-300 mb-2 text-center">
                        Enter a Solana address
                      </p>
                      <p className="text-sm text-slate-400 text-center">
                        Try the example address below
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Transactions Tab
                <div className="h-full flex flex-col">
                  {transactions.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <span className="text-sm">📊</span>
                        </div>
                        <p className="text-slate-300 font-medium text-sm">
                          Showing{" "}
                          <span className="text-cyan-300">
                            {transactions.length}
                          </span>{" "}
                          transaction{transactions.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto pr-2">
                          <div className="space-y-2">
                            {transactions.slice(0, 10).map((tx, index) => (
                              <div
                                key={tx.signature}
                                className="p-3 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-lg border border-white/15 hover:border-cyan-400/30 transition-all duration-200"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-md flex-shrink-0">
                                      <span className="font-bold text-cyan-300 text-xs">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-mono text-xs bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent truncate">
                                        {shortenSignature(tx.signature)}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button
                                      onClick={() =>
                                        copyToClipboard(tx.signature)
                                      }
                                      className="px-2 py-1 text-xs bg-white/10 hover:bg-white/15 rounded transition-all duration-200 border border-white/20"
                                    >
                                      Copy
                                    </button>
                                    <a
                                      href={`https://solscan.io/tx/${tx.signature}?cluster=devnet`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 hover:from-cyan-500 hover:to-cyan-600 rounded transition-all duration-200"
                                      title="View on Solscan"
                                    >
                                      <FiExternalLink className="text-xs" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : balance || address ? (
                    <div className="h-full flex flex-col items-center justify-center py-8">
                      <div className="text-5xl mb-4 text-slate-500/50">📭</div>
                      <p className="text-lg text-slate-300 mb-2 text-center">
                        No transactions found
                      </p>
                      <p className="text-sm text-slate-400 text-center">
                        This address hasn't made any transactions yet
                      </p>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-8">
                      <div className="text-5xl mb-4 text-slate-500/50 animate-pulse">
                        🔍
                      </div>
                      <p className="text-lg text-slate-300 mb-2 text-center">
                        Enter a Solana address
                      </p>
                      <p className="text-sm text-slate-400 text-center">
                        Search for any Solana address
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <footer className="text-center mt-4 text-slate-300 text-xs flex-shrink-0">
            <div className="mb-3">
              <p className="font-medium">
                <span className="text-cyan-300">Solana Devnet</span> •{" "}
                <a
                  href="http://localhost:3000"
                  className="text-purple-300 hover:text-purple-200"
                >
                  Backend: localhost:3000
                </a>
              </p>
            </div>

            <div>
              <p className="mb-2">Try test address:</p>
              <button
                onClick={() =>
                  setAddress("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin")
                }
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 rounded-lg font-medium transition-all duration-200 border border-purple-400/30 hover:border-purple-400/50 text-xs"
              >
                9xQeWvG81...PusVFin
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
