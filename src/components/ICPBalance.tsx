import { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {
  createAuthClient,
  createAgent,
  defaultIcpNetwork,
  ICP_LEDGER_CANISTER_ID,
  isPlugAvailable,
  getPlugWallet,
  principalToAccountId,
  createLedgerActor,
} from "../config/icp";

interface ICPBalanceState {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  principal: Principal | null;
  walletType: "internet-identity" | "plug" | null;
}

// E8s转换为ICP的工具函数
const e8sToIcp = (e8s: bigint): number => {
  return Number(e8s) / 100_000_000; // 1 ICP = 10^8 e8s
};

// ICP Ledger响应类型定义
interface BalanceResponse {
  e8s: bigint;
}

export default function ICPBalance() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [balanceState, setBalanceState] = useState<ICPBalanceState>({
    balance: null,
    isLoading: false,
    error: null,
    isConnected: false,
    principal: null,
    walletType: null,
  });

  // 初始化AuthClient并检查连接状态
  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await createAuthClient();
        setAuthClient(client);

        const isAuthenticated = await client.isAuthenticated();
        if (isAuthenticated) {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal();

          setBalanceState((prev) => ({
            ...prev,
            isConnected: true,
            principal,
            walletType: "internet-identity",
          }));
        }
      } catch (error) {
        console.error("初始化AuthClient失败:", error);
        setBalanceState((prev) => ({
          ...prev,
          error: "初始化失败",
        }));
      }
    };

    const checkPlugConnection = async () => {
      if (isPlugAvailable()) {
        const plug = getPlugWallet();
        try {
          const isConnected = await plug.isConnected();
          if (isConnected) {
            const principal = await plug.getPrincipal();
            setBalanceState((prev) => ({
              ...prev,
              isConnected: true,
              principal: Principal.fromText(principal.toString()),
              walletType: "plug",
            }));
          }
        } catch (error) {
          console.error("检查Plug连接状态失败:", error);
        }
      }
    };

    initAuthClient();
    checkPlugConnection();
  }, []);

  // 获取ICP余额
  const fetchBalance = async () => {
    if (!balanceState.isConnected || !balanceState.principal) {
      return;
    }

    setBalanceState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      let balance: number;

      if (balanceState.walletType === "plug" && isPlugAvailable()) {
        // 使用Plug钱包查询余额
        const plug = getPlugWallet();

        try {
          // 根据Plug文档，使用requestBalance获取所有代币余额
          const balances = await plug.requestBalance();

          // 查找ICP余额 (ICP的canister ID或symbol)
          const icpBalance = balances.find(
            (token: any) =>
              token.canisterId === ICP_LEDGER_CANISTER_ID ||
              token.symbol === "ICP" ||
              token.name === "Internet Computer"
          );

          balance = icpBalance ? parseFloat(icpBalance.amount) : 0;
        } catch (plugError) {
          console.error("Plug钱包余额查询失败:", plugError);
          // 如果requestBalance不存在，尝试使用agent方式查询
          const agent = plug.agent;
          if (agent) {
            const idlFactory = createLedgerActor(agent);
            const ledgerActor = Actor.createActor(idlFactory, {
              agent,
              canisterId: ICP_LEDGER_CANISTER_ID,
            });

            const accountId = principalToAccountId(balanceState.principal);
            const balanceResponse = (await ledgerActor.account_balance({
              account: Array.from(accountId),
            })) as BalanceResponse;

            balance = e8sToIcp(balanceResponse.e8s);
          } else {
            throw new Error("Plug钱包API不可用");
          }
        }
      } else if (authClient) {
        // 使用Internet Identity查询余额
        const identity = authClient.getIdentity();
        const agent = await createAgent(identity);

        // 创建Ledger Actor
        const idlFactory = createLedgerActor(agent);
        const ledgerActor = Actor.createActor(idlFactory, {
          agent,
          canisterId: ICP_LEDGER_CANISTER_ID,
        });

        // 将Principal转换为账户标识符
        const accountId = principalToAccountId(balanceState.principal);

        // 查询余额
        const balanceResponse = (await ledgerActor.account_balance({
          account: Array.from(accountId),
        })) as BalanceResponse;

        // 将e8s转换为ICP
        balance = e8sToIcp(balanceResponse.e8s);
      } else {
        throw new Error("无法获取钱包实例");
      }

      setBalanceState((prev) => ({
        ...prev,
        balance,
        isLoading: false,
      }));
    } catch (error) {
      console.error("获取ICP余额失败:", error);
      setBalanceState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "获取余额失败",
        isLoading: false,
      }));
    }
  };

  // 监听连接状态变化
  useEffect(() => {
    if (balanceState.isConnected && balanceState.principal) {
      fetchBalance();
    } else {
      setBalanceState((prev) => ({
        ...prev,
        balance: null,
        error: null,
      }));
    }
  }, [balanceState.isConnected, balanceState.principal]);

  if (!balanceState.isConnected) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-semibold text-white mb-6">ICP 余额</h2>
        <div className="text-center">
          <p className="text-gray-400">请先连接ICP钱包</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white">ICP 余额</h2>
        <button
          onClick={fetchBalance}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all"
          disabled={balanceState.isLoading}
        >
          {balanceState.isLoading ? "刷新中..." : "刷新"}
        </button>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4">
          <p className="text-purple-300 text-sm mb-1">当前网络</p>
          <p className="text-white font-semibold">{defaultIcpNetwork.name}</p>
        </div>

        {balanceState.isLoading && (
          <div className="bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-300">加载余额中...</p>
            </div>
          </div>
        )}

        {balanceState.error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">获取余额失败</p>
            <p className="text-red-400 text-xs mt-1">{balanceState.error}</p>
          </div>
        )}

        {balanceState.balance !== null && !balanceState.isLoading && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
            <div className="text-center">
              <p className="text-green-300 text-sm mb-2">ICP 余额</p>
              <p className="text-3xl font-bold text-white mb-1">
                {balanceState.balance.toFixed(6)}
              </p>
              <p className="text-green-300 text-lg">ICP</p>
            </div>
          </div>
        )}

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm mb-2">Principal ID</p>
          <p className="text-white font-mono text-xs break-all">
            {balanceState.principal?.toString()}
          </p>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm mb-2">钱包类型</p>
          <p className="text-white font-semibold">
            {balanceState.walletType === "internet-identity"
              ? "🔐 Internet Identity"
              : "🔌 Plug 钱包"}
          </p>
        </div>
      </div>
    </div>
  );
}
