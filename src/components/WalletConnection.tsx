import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { useEffect } from 'react';

export default function WalletConnection() {
  const { address, isConnected } = useAccount();
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
        // 这里可以添加额外的处理逻辑
        window.location.reload(); // 简单的页面刷新来更新状态
      }
    };

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [disconnect]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-6">
          钱包连接
        </h2>
        
        <div className="flex justify-center mb-6">
          <ConnectButton />
        </div>

        {isConnected && address && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-300 text-sm mb-2">✅ 钱包已连接</p>
            <p className="text-white font-mono text-sm break-all">
              {address}
            </p>
          </div>
        )}

        {!isConnected && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              ⚠️ 请连接您的钱包以开始使用
            </p>
          </div>
        )}
      </div>
    </div>
  );
}