import { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {
  createAuthClient,
  getInternetIdentityUrl,
  defaultIcpNetwork,
  isPlugAvailable,
  getPlugWallet,
  PLUG_WALLET_CONFIG,
} from "../config/icp";

interface ICPWalletState {
  isConnected: boolean;
  identity: Identity | null;
  principal: Principal | null;
  isLoading: boolean;
  error: string | null;
  walletType: "internet-identity" | "plug" | null;
}

export default function ICPWalletConnection() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [walletState, setWalletState] = useState<ICPWalletState>({
    isConnected: false,
    identity: null,
    principal: null,
    isLoading: false,
    error: null,
    walletType: null,
  });

  // 初始化AuthClient
  useEffect(() => {
    const initAuthClient = async () => {
      try {
        const client = await createAuthClient();
        setAuthClient(client);

        // 检查Internet Identity是否已经认证
        const isAuthenticated = await client.isAuthenticated();
        if (isAuthenticated) {
          const identity = client.getIdentity();
          const principal = identity.getPrincipal();

          setWalletState({
            isConnected: true,
            identity,
            principal,
            isLoading: false,
            error: null,
            walletType: "internet-identity",
          });
        }
      } catch (error) {
        console.error("初始化AuthClient失败:", error);
        setWalletState((prev) => ({
          ...prev,
          error: "初始化失败",
          isLoading: false,
        }));
      }
    };

    // 检查Plug钱包连接状态
    const checkPlugConnection = async () => {
      if (isPlugAvailable()) {
        const plug = getPlugWallet();
        try {
          const isConnected = await plug.isConnected();
          if (isConnected) {
            const principal = await plug.getPrincipal();
            setWalletState({
              isConnected: true,
              identity: null, // Plug钱包不提供Identity对象
              principal: Principal.fromText(principal.toString()),
              isLoading: false,
              error: null,
              walletType: "plug",
            });
          }
        } catch (error) {
          console.error("检查Plug连接状态失败:", error);
        }
      }
    };

    initAuthClient();
    checkPlugConnection();
  }, []);

  // 连接Internet Identity
  const connectInternetIdentity = async () => {
    if (!authClient) return;

    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await authClient.login({
        identityProvider: getInternetIdentityUrl(),
        onSuccess: () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();

          setWalletState({
            isConnected: true,
            identity,
            principal,
            isLoading: false,
            error: null,
            walletType: "internet-identity",
          });

          console.log("Internet Identity已连接:", principal.toString());
        },
        onError: (error) => {
          console.error("连接失败:", error);
          setWalletState((prev) => ({
            ...prev,
            error: "连接失败",
            isLoading: false,
          }));
        },
      });
    } catch (error) {
      console.error("连接Internet Identity失败:", error);
      setWalletState((prev) => ({
        ...prev,
        error: "连接失败",
        isLoading: false,
      }));
    }
  };

  // 连接Plug钱包
  const connectPlug = async () => {
    if (!isPlugAvailable()) {
      setWalletState((prev) => ({
        ...prev,
        error: "请安装Plug钱包扩展",
      }));
      return;
    }

    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const plug = getPlugWallet();
      const result = await plug.requestConnect(PLUG_WALLET_CONFIG);

      if (result) {
        const principal = await plug.getPrincipal();
        setWalletState({
          isConnected: true,
          identity: null,
          principal: Principal.fromText(principal.toString()),
          isLoading: false,
          error: null,
          walletType: "plug",
        });

        console.log("Plug钱包已连接:", principal.toString());
      } else {
        setWalletState((prev) => ({
          ...prev,
          error: "用户取消连接",
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("连接Plug钱包失败:", error);
      setWalletState((prev) => ({
        ...prev,
        error: "连接Plug钱包失败",
        isLoading: false,
      }));
    }
  };

  // 断开连接
  const disconnectWallet = async () => {
    try {
      if (walletState.walletType === "internet-identity" && authClient) {
        await authClient.logout();
      } else if (walletState.walletType === "plug" && isPlugAvailable()) {
        const plug = getPlugWallet();
        await plug.disconnect();
      }

      setWalletState({
        isConnected: false,
        identity: null,
        principal: null,
        isLoading: false,
        error: null,
        walletType: null,
      });

      console.log("ICP钱包已断开连接");
    } catch (error) {
      console.error("断开连接失败:", error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-6">ICP 钱包连接</h2>

        {!walletState.isConnected ? (
          <div className="space-y-4">
            {/* Internet Identity 连接按钮 */}
            <button
              onClick={connectInternetIdentity}
              disabled={walletState.isLoading || !authClient}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {walletState.isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>连接中...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <img src="/icplogo.png" alt="icp" className="w-6 h-6" />
                  <span>连接 Internet Identity</span>
                </div>
              )}
            </button>

            {/* Plug钱包连接按钮 */}
            <button
              onClick={connectPlug}
              disabled={walletState.isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {walletState.isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>连接中...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <img src="/pluglogo.png" alt="plug" className="w-6 h-6" />
                  <span>连接 Plug 钱包</span>
                </div>
              )}
            </button>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">
                  Internet Identity
                </p>
                <p className="text-blue-200 text-xs">
                  官方去中心化身份验证系统，支持生物识别和硬件密钥
                </p>
              </div>
              <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-4">
                <p className="text-orange-300 text-sm font-semibold mb-1">
                  Plug 钱包
                </p>
                <p className="text-orange-200 text-xs">
                  流行的ICP浏览器扩展钱包，支持代币管理和DApp交互
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-300 text-sm mb-2">
                ✅{" "}
                {walletState.walletType === "internet-identity"
                  ? "Internet Identity"
                  : "Plug钱包"}{" "}
                已连接
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-300 text-xs">钱包类型:</p>
                  <p className="text-white text-sm font-semibold">
                    {walletState.walletType === "internet-identity"
                      ? "🔐 Internet Identity"
                      : "🔌 Plug 钱包"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-300 text-xs">Principal ID:</p>
                  <p className="text-white font-mono text-sm break-all">
                    {walletState.principal?.toString()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={disconnectWallet}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              断开连接
            </button>
          </div>
        )}

        {walletState.error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">❌ {walletState.error}</p>
            {walletState.error.includes("Plug") && (
              <p className="text-red-400 text-xs mt-1">
                请访问{" "}
                <a
                  href="https://plugwallet.ooo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  plugwallet.ooo
                </a>{" "}
                安装Plug钱包扩展
              </p>
            )}
          </div>
        )}

        <div className="mt-6 bg-gray-500/20 border border-gray-500/30 rounded-lg p-4">
          <p className="text-gray-300 text-sm mb-2">
            🌐 当前网络: {defaultIcpNetwork.name}
          </p>
          <p className="text-gray-400 text-xs">
            💡 支持两种连接方式：Internet Identity（官方）和 Plug钱包（第三方）
          </p>
        </div>
      </div>
    </div>
  );
}
