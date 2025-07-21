import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

export default function SolanaBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!publicKey || !connected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取余额失败');
      console.error('获取Solana余额失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setBalance(null);
      setError(null);
    }
  }, [connected, publicKey, connection]);

  if (!connected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-6">Solana 余额</h2>
        <div className="text-center">
          <p className="text-gray-400">请先连接Solana钱包</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">Solana 余额</h2>
        <button
          onClick={fetchBalance}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-300 text-sm mb-1">当前网络</p>
          <p className="text-white font-semibold">Solana Devnet</p>
        </div>

        {loading && (
          <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
            <p className="text-gray-300">加载余额中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">获取余额失败</p>
            <p className="text-red-400 text-xs mt-1">{error}</p>
          </div>
        )}

        {balance !== null && !loading && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
            <div className="text-center">
              <p className="text-green-300 text-sm mb-2">SOL 余额</p>
              <p className="text-3xl font-bold text-white mb-1">
                {balance.toFixed(6)}
              </p>
              <p className="text-green-300 text-lg">SOL</p>
            </div>
          </div>
        )}

        <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm text-center">
            💡 当前连接到Solana Devnet测试网络
          </p>
        </div>
      </div>
    </div>
  );
}