import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
  bsc,
  bscTestnet,
} from "wagmi/chains";
import { defineChain } from "viem";

// 定义自定义CoreChain网络
const coreChain = defineChain({
  id: 568812,
  name: "CoreChain",
  nativeCurrency: {
    decimals: 18,
    name: "RFS",
    symbol: "RFS",
  },
  rpcUrls: {
    default: {
      http: ["http://192.168.2.173:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "CoreChain Explorer",
      url: "http://192.168.2.173:8545",
    },
  },
});

// 简化配置 - 只支持浏览器扩展钱包（如MetaMask）
export const simpleConfig = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, bsc, bscTestnet, coreChain],
  connectors: [
    injected(), // 只支持注入式钱包（MetaMask等浏览器扩展）
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [coreChain.id]: http('http://192.168.2.173:8545'),
  },
});

export const supportedChains = [
  {
    id: mainnet.id,
    name: "Ethereum",
    nativeCurrency: "ETH",
    rpcUrl: mainnet.rpcUrls.default.http[0],
  },
  {
    id: polygon.id,
    name: "Polygon",
    nativeCurrency: "MATIC",
    rpcUrl: polygon.rpcUrls.default.http[0],
  },
  {
    id: optimism.id,
    name: "Optimism",
    nativeCurrency: "ETH",
    rpcUrl: optimism.rpcUrls.default.http[0],
  },
  {
    id: arbitrum.id,
    name: "Arbitrum",
    nativeCurrency: "ETH",
    rpcUrl: arbitrum.rpcUrls.default.http[0],
  },
  {
    id: base.id,
    name: "Base",
    nativeCurrency: "ETH",
    rpcUrl: base.rpcUrls.default.http[0],
  },
  {
    id: sepolia.id,
    name: "Sepolia",
    nativeCurrency: "ETH",
    rpcUrl: sepolia.rpcUrls.default.http[0],
  },
  {
    id: bsc.id,
    name: bsc.name,
    nativeCurrency: "BNB",
    rpcUrl: bsc.rpcUrls.default.http[0],
  },
  {
    id: bscTestnet.id,
    name: bscTestnet.name,
    nativeCurrency: "tBNB",
    rpcUrl: bscTestnet.rpcUrls.default.http[0],
  },
  {
    id: coreChain.id,
    name: "CoreChain",
    nativeCurrency: "RFS",
    rpcUrl: "http://192.168.2.173:8545",
  },
];