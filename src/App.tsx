import "@rainbow-me/rainbowkit/styles.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { config } from "./config/wagmi";
import { useSolanaWallets, defaultSolanaNetwork } from "./config/solana";
import WalletConnection from "./components/WalletConnection";
import TokenBalance from "./components/TokenBalance";
import NetworkSwitcher from "./components/NetworkSwitcher";
import SolanaWalletConnection from "./components/SolanaWalletConnection";
import SolanaBalance from "./components/SolanaBalance";
import ICPWalletConnection from "./components/ICPWalletConnection";
import ICPBalance from "./components/ICPBalance";
import { useState } from "react";

const queryClient = new QueryClient();

const tabs = [
  {
    name: "EVM",
    value: "evm",
  },
  {
    name: "Solana",
    value: "solana",
  },
  {
    name: "ICP",
    value: "icp",
  },
] as const;

function App() {
  const [activeTab, setActiveTab] = useState<"evm" | "solana" | "icp">("evm");
  const solanaWallets = useSolanaWallets();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <ConnectionProvider endpoint={defaultSolanaNetwork.endpoint}>
            <WalletProvider wallets={solanaWallets} autoConnect>
              <WalletModalProvider>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
                  <div className="container mx-auto px-4 py-8">
                    <header className="text-center mb-12">
                      <h1 className="text-4xl font-bold text-white mb-4">
                        Multi-Chain Web3 DApp
                      </h1>
                      <p className="text-gray-300 text-lg">
                        支持EVM链、Solana和ICP的DApp
                      </p>
                    </header>

                    {/* 标签切换 */}
                    <div className="max-w-4xl mx-auto mb-8">
                      <div className="flex justify-center bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 space-x-2">

                        {tabs.map((tab) => (
                          <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`cursor-pointer px-6 py-3 rounded-xl font-semibold transition-all                              
                               ${
                                 activeTab === tab.value
                                   ? "bg-blue-600 text-white shadow-lg"
                                   : "text-blue-300 hover:text-white hover:bg-white/10"
                               }`}
                          >
                            {tab.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                      {activeTab === "evm" && (
                        <>
                          <WalletConnection />
                          <div className="grid md:grid-cols-2 gap-8">
                            <TokenBalance />
                            <NetworkSwitcher />
                          </div>
                        </>
                      )}

                      {activeTab === "solana" && (
                        <>
                          <SolanaWalletConnection />
                          <div className="grid md:grid-cols-1 gap-8">
                            <SolanaBalance />
                          </div>
                        </>
                      )}

                      {activeTab === "icp" && (
                        <>
                          <ICPWalletConnection />
                          <div className="grid md:grid-cols-1 gap-8">
                            <ICPBalance />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
