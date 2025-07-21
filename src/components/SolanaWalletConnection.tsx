import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export default function SolanaWalletConnection() {
  const { publicKey, connected, disconnect } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      console.log('Solana钱包已连接:', publicKey.toString());
    }
  }, [connected, publicKey]);

  if (!mounted) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Solana 钱包连接
        </h2>
        
        <div className="flex justify-center mb-6">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg !px-6 !py-3 !text-white !font-semibold !transition-colors" />
        </div>

        {connected && publicKey && (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm mb-2">✅ Solana钱包已连接</p>
              <p className="text-white font-mono text-sm break-all">
                {publicKey.toString()}
              </p>
            </div>
            
            <button
              onClick={disconnect}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              断开连接
            </button>
          </div>
        )}

        {!connected && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
            <p className="text-purple-300 text-sm">
              💜 请连接您的Solana钱包 (Phantom, Solflare等)
            </p>
          </div>
        )}

        <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 支持的钱包: Phantom, Solflare, Torus, Ledger
          </p>
        </div>
      </div>
    </div>
  );
}