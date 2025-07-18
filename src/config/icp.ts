import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// ICP网络配置
export const icpNetworks = [
  {
    name: 'IC Mainnet',
    host: 'https://ic0.app',
    isLocal: false,
  },
  {
    name: 'Local Replica',
    host: 'http://localhost:4943',
    isLocal: true,
  },
];

// 默认网络
export const defaultIcpNetwork = icpNetworks[0]; // IC Mainnet

// Internet Identity配置
export const INTERNET_IDENTITY_URL = 'https://identity.ic0.app';
export const LOCAL_INTERNET_IDENTITY_URL = 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943';

// 创建AuthClient
export const createAuthClient = async () => {
  return await AuthClient.create({
    idleOptions: {
      disableIdle: true,
      disableDefaultIdleCallback: true,
    },
  });
};

// 创建Agent
export const createAgent = async (identity?: any, host: string = defaultIcpNetwork.host) => {
  const agent = new HttpAgent({
    host,
    identity,
  });

  // 在本地开发环境中禁用证书验证
  if (host.includes('localhost')) {
    agent.fetchRootKey();
  }

  return agent;
};

// 获取Internet Identity URL
export const getInternetIdentityUrl = (isLocal: boolean = false) => {
  return isLocal ? LOCAL_INTERNET_IDENTITY_URL : INTERNET_IDENTITY_URL;
};

// ICP余额查询相关
export const ICP_LEDGER_CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

// Plug钱包相关配置
export const PLUG_WALLET_CONFIG = {
  whitelist: [ICP_LEDGER_CANISTER_ID],
  host: defaultIcpNetwork.host,
  timeout: 50000,
};

// 检查Plug钱包是否可用
export const isPlugAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'ic' in window && 'plug' in (window as any).ic;
};

// 获取Plug钱包实例
export const getPlugWallet = () => {
  if (isPlugAvailable()) {
    return (window as any).ic.plug;
  }
  return null;
};

// 账户标识符相关工具函数
import { sha224 } from '@dfinity/principal/lib/esm/utils/sha224';
import { getCrc32 } from '@dfinity/principal/lib/esm/utils/getCrc';

// 将Principal转换为账户标识符
export const principalToAccountId = (principal: Principal, subAccount?: Uint8Array): Uint8Array => {
  const domainSeparator = new TextEncoder().encode('\x0Aaccount-id');
  const principalBytes = principal.toUint8Array();
  const subAccountBytes = subAccount || new Uint8Array(32);
  
  // 组合所有字节
  const combined = new Uint8Array(domainSeparator.length + principalBytes.length + subAccountBytes.length);
  combined.set(domainSeparator, 0);
  combined.set(principalBytes, domainSeparator.length);
  combined.set(subAccountBytes, domainSeparator.length + principalBytes.length);
  
  // 计算SHA-224哈希
  const hash = sha224(combined);
  
  // 计算CRC32校验和
  const crc32 = getCrc32(hash);
  
  // 将CRC32转换为4字节数组 (big-endian)
  const crcBytes = new Uint8Array(4);
  crcBytes[0] = (crc32 >>> 24) & 0xFF;
  crcBytes[1] = (crc32 >>> 16) & 0xFF;
  crcBytes[2] = (crc32 >>> 8) & 0xFF;
  crcBytes[3] = crc32 & 0xFF;
  
  // 组合CRC32和哈希
  const accountId = new Uint8Array(32);
  accountId.set(crcBytes, 0);
  accountId.set(hash, 4);
  
  return accountId;
};

// 将账户标识符转换为十六进制字符串
export const accountIdToHex = (accountId: Uint8Array): string => {
  return Array.from(accountId)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// ICP Ledger Canister接口定义
export const createLedgerActor = (agent: HttpAgent) => {
  const idlFactory = ({ IDL }: any) => {
    const AccountIdentifier = IDL.Vec(IDL.Nat8);
    const Tokens = IDL.Record({ e8s: IDL.Nat64 });
    const AccountBalanceArgs = IDL.Record({
      account: AccountIdentifier,
    });
    
    return IDL.Service({
      account_balance: IDL.Func([AccountBalanceArgs], [Tokens], ['query']),
    });
  };

  return idlFactory;
};