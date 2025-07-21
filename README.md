# Multi-Chain Web3 DApp

一个现代化的多链 Web3 DApp，同时支持 EVM 链、Solana 链和 ICP 链的钱包连接、代币余额查询和网络切换功能。

## 🚀 功能特性

- 🔗 **多链钱包连接**: 支持 EVM 链、Solana 链和 ICP 链钱包
- 💰 **余额查询**: 实时查看原生代币余额（ETH、MATIC、SOL、ICP 等）
- 🔄 **网络切换**: 支持多个主流区块链网络
- 👂 **事件监听**: 自动监听钱包切换和网络变化
- 🎨 **现代 UI**: 使用 TailwindCSS 4 构建的响应式界面
- 🌐 **三链支持**: 一个应用同时支持 EVM 生态、Solana 生态和 Internet Computer 生态
- 🔐 **去中心化身份**: 支持 Internet Identity 身份验证系统

## 🌍 支持的网络

### EVM 链

- Ethereum 主网
- Polygon
- Optimism
- Arbitrum
- Base
- BSC (币安智能链)
- BSC 测试网
- Sepolia 测试网
- 自定义 CoreChain 网络

### Solana 链

- Solana Mainnet Beta
- Solana Devnet
- Solana Testnet

### ICP 链

- Internet Computer Mainnet
- 本地开发网络 (Local Replica)

## 🛠️ 技术栈

### 核心框架

- **React 18**: 现代 React 框架
- **TypeScript**: 类型安全
- **TailwindCSS 4**: 现代 CSS 框架

### EVM 链集成

- **Wagmi**: Web3 React 钩子
- **RainbowKit**: 钱包连接 UI
- **Viem**: 以太坊交互库

### Solana 链集成

- **@solana/wallet-adapter-react**: Solana 钱包适配器
- **@solana/wallet-adapter-react-ui**: Solana 钱包 UI 组件
- **@solana/web3.js**: Solana Web3 JavaScript SDK

### ICP 链集成

- **@dfinity/agent**: ICP HTTP 代理
- **@dfinity/auth-client**: Internet Identity 认证客户端
- **@dfinity/identity**: ICP 身份管理
- **@dfinity/principal**: Principal ID 处理

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置项目

在 `src/config/wagmi.ts` 中替换 `YOUR_PROJECT_ID` 为您的 WalletConnect Project ID：

1. 访问 [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. 创建新项目
3. 复制 Project ID
4. 替换配置文件中的 `YOUR_PROJECT_ID`

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 使用说明

### EVM 链操作

1. **连接钱包**: 点击"Connect Wallet"按钮连接 MetaMask 等 EVM 钱包
2. **查看余额**: 连接后自动显示当前网络的原生代币余额
3. **切换网络**: 在网络切换面板中选择不同的区块链网络
4. **监听变化**: 应用会自动监听钱包账户切换和网络变化

### Solana 链操作

1. **连接钱包**: 切换到 Solana 标签页，连接 Phantom 或 Solflare 钱包
2. **查看余额**: 自动显示 SOL 余额
3. **网络支持**: 默认连接到 Devnet 测试网络

### ICP 链操作

1. **Internet Identity**: 切换到 ICP 标签页，使用 Internet Identity 进行身份验证
2. **Plug钱包**: 或者选择连接 Plug 钱包浏览器扩展
3. **去中心化登录**: 通过生物识别或安全密钥进行安全登录
4. **Principal ID**: 显示您的唯一 Principal 标识符
5. **余额查询**: 查看 ICP 代币余额（演示版本）

## 主要组件

### EVM 链组件

- `WalletConnection`: EVM 钱包连接和状态管理
- `TokenBalance`: EVM 代币余额显示和刷新
- `NetworkSwitcher`: EVM 网络切换功能

### Solana 链组件

- `SolanaWalletConnection`: Solana 钱包连接管理
- `SolanaBalance`: SOL 余额查询和显示

### ICP 链组件

- `ICPWalletConnection`: Internet Identity 身份验证
- `ICPBalance`: ICP 余额查询和 Principal ID 显示

## 开发注意事项

### EVM 链开发

- 确保浏览器安装了 Web3 钱包扩展（如 MetaMask）
- 测试时可以使用 Sepolia 测试网
- 生产环境需要配置正确的 RPC 端点

### Solana 链开发

- 安装 Phantom 或 Solflare 钱包扩展
- 默认使用 Devnet 测试网络
- 可以从 Solana 水龙头获取测试 SOL

### ICP 链开发

- **Internet Identity**: 无需安装额外钱包扩展，提供去中心化身份验证
- **Plug钱包**: 可选择安装Plug浏览器扩展钱包
- 支持生物识别和硬件安全密钥
- 当前余额查询为演示版本，生产环境需要完整的 Ledger 集成

### 钱包准备

- **EVM**: MetaMask, WalletConnect 兼容钱包
- **Solana**: Phantom, Solflare, Torus, Ledger
- **ICP**: Internet Identity (无需额外安装) 或 Plug钱包扩展

## 许可证

MIT License
