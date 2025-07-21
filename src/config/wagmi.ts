import { getDefaultConfig } from "@rainbow-me/rainbowkit";
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
      url: "http://192.168.2.173:8545", // 如果有区块浏览器的话替换这个URL
    },
  },
  iconUrl: "/icplogo.png", // 使用 public 文件夹中的图标
  iconBackground: "#000000", // 图标背景色（可选）
});

export const config = getDefaultConfig({
  appName: "Web3 DApp",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID, 
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    bsc,
    bscTestnet,
    coreChain,
  ],
  ssr: false,
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
    id: 568812,
    name: "CoreChain",
    nativeCurrency: "RFS",
    rpcUrl: "http://192.168.2.173:8545",
  },
];
