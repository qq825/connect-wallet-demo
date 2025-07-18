import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

// Solana网络配置
export const solanaNetworks = [
  {
    name: 'Mainnet Beta',
    network: WalletAdapterNetwork.Mainnet,
    endpoint: clusterApiUrl(WalletAdapterNetwork.Mainnet),
  },
  {
    name: 'Devnet',
    network: WalletAdapterNetwork.Devnet,
    endpoint: clusterApiUrl(WalletAdapterNetwork.Devnet),
  },
  {
    name: 'Testnet',
    network: WalletAdapterNetwork.Testnet,
    endpoint: clusterApiUrl(WalletAdapterNetwork.Testnet),
  },
];

// 默认网络
export const defaultSolanaNetwork = solanaNetworks[1]; // Devnet

// Solana钱包适配器配置
export const useSolanaWallets = () => {
  return useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );
};

// 创建Solana连接
export const createSolanaConnection = (endpoint: string) => {
  return new Connection(endpoint, 'confirmed');
};