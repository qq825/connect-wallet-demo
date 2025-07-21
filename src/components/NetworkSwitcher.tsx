import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { supportedChains } from '../config/wagmi';
import { useState } from 'react';

export default function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const { isConnected } = useAccount();
  const [switchingTo, setSwitchingTo] = useState<number | null>(null);

  const handleSwitchNetwork = async (targetChainId: number) => {
    if (!switchChain) return;
    
    setSwitchingTo(targetChainId);
    try {
      await switchChain({ chainId: targetChainId });
    } catch (error) {
      console.error('切换网络失败:', error);
    } finally {
      setSwitchingTo(null);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-6">网络切换</h2>
        <div className="text-center">
          <p className="text-gray-400">请先连接钱包</p>
        </div>
      </div>
    );
  }

  const currentChain = supportedChains.find(chain => chain.id === chainId);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-2xl font-semibold text-white mb-6">网络切换</h2>
      
      {currentChain && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-6">
          <p className="text-green-300 text-sm mb-1">当前网络</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{currentChain.name}</p>
              <p className="text-green-300 text-sm">
                原生代币: {currentChain.nativeCurrency}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-gray-300 text-sm mb-4">选择要切换的网络：</p>
        
        {supportedChains.map((chain) => {
          const isCurrentChain = chain.id === chainId;
          const isSwitching = switchingTo === chain.id;
          
          return (
            <button
              key={chain.id}
              onClick={() => handleSwitchNetwork(chain.id)}
              disabled={isCurrentChain || isPending || isSwitching}
              className={`w-full p-4 rounded-lg border transition-all ${
                isCurrentChain
                  ? 'bg-green-500/20 border-green-500/30 cursor-not-allowed'
                  : 'bg-gray-500/20 border-gray-500/30 hover:bg-gray-500/30 hover:border-gray-400/50'
              } ${
                isSwitching ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className={`font-semibold ${
                    isCurrentChain ? 'text-green-300' : 'text-white'
                  }`}>
                    {chain.name}
                  </p>
                  <p className={`text-sm ${
                    isCurrentChain ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {chain.nativeCurrency}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isSwitching && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isCurrentChain && (
                    <span className="text-green-400 text-sm">✓ 当前</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-300 text-sm text-center">
          💡 切换网络后余额会自动更新
        </p>
      </div>
    </div>
  );
}