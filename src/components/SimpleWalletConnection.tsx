import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect } from 'react';

export default function SimpleWalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // 监听钱包切换
  useEffect(() => {
    if (isConnected && address) {
      console.log('钱包已连接:', address);
    }
  }, [address, isConnected]);

  // 监听账户变化
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log('钱包已断开连接');
        disconnect();
      } else {
        console.log('账户已切换到:', accounts[0]);
        window.location.reload();
      }
    };

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        if(window.ethereum){
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [disconnect]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-6">
          钱包连接 (简化版)
        </h2>
        
        {!isConnected ? (
          <div className="space-y-4">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? '连接中...' : `连接 ${connector.name}`}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm mb-2">✅ 钱包已连接</p>
              <p className="text-white font-mono text-sm break-all">
                {address}
              </p>
            </div>
            <button
              onClick={() => disconnect()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              断开连接
            </button>
          </div>
        )}

        <div className="mt-6 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-300 text-sm">
            ⚠️ 简化版只支持浏览器扩展钱包（如MetaMask）
          </p>
        </div>
      </div>
    </div>
  );
}