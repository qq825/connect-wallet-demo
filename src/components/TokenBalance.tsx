import { useAccount, useBalance, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { supportedChains } from '../config/wagmi';

export default function TokenBalance() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const { data: balance, isLoading, error, refetch } = useBalance({
    address: address,
  });

  const currentChain = supportedChains.find(chain => chain.id === chainId);

  const handleRefresh = () => {
    refetch();
  };

  if (!isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-6">代币余额</h2>
        <div className="text-center">
          <p className="text-gray-400">请先连接钱包</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">代币余额</h2>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? '刷新中...' : '刷新'}
        </button>
      </div>

      <div className="space-y-4">
        {currentChain && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm mb-1">当前网络</p>
            <p className="text-white font-semibold">{currentChain.name}</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
            <p className="text-gray-300">加载余额中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">获取余额失败</p>
            <p className="text-red-400 text-xs mt-1">{error.message}</p>
          </div>
        )}

        {balance && !isLoading && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
            <div className="text-center">
              <p className="text-green-300 text-sm mb-2">原生代币余额</p>
              <p className="text-3xl font-bold text-white mb-1">
                {parseFloat(formatEther(balance.value)).toFixed(6)}
              </p>
              <p className="text-green-300 text-lg">
                {balance.symbol}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm text-center">
            💡 提示：切换网络可查看不同链上的余额
          </p>
        </div>
      </div>
    </div>
  );
}