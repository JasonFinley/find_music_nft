import Layout from "../components/Layout";
import { useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useNetwork, chain } from "wagmi";
import PinataConfig from "../components/PinataConfig";
import ContractInfo from "../components/ContractInfo";

const Initpage = () => {

  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: accountBalance, isError : isErrorBalance, isLoading : isLoadingBalance } = useBalance( { addressOrName: account?.address, } );
  const { activeChain, switchNetwork } = useNetwork({ chainId: chain.localhost.id });

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.localhost.id) {
      switchNetwork(chain.localhost.id);
    }
  }, [activeChain, switchNetwork]);

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center my-5">
      { account? 
          (
            <div>
              <div>錢包地址: { account.address }</div>
              <div>剩多少錢: { accountBalance?.formatted } { accountBalance?.symbol }</div>
              <button onClick={ disconnect }>取消連結</button>
            </div>
          ):(
            <div>
              <div>錢包地址: please connect MetaMask </div>
              {connectors?.map((connector) => (
                <button
                  disabled={!connector?.ready}
                  key={connector?.id}
                  onClick={() => connect(connector)}
                >
                  {connector?.name}
                  {!connector?.ready && " (不支援)"}
                  {isConnecting && connector?.id === pendingConnector?.id && " (連結中)"}
                </button>
              ))}
            </div>
          )
        }
        <div> <PinataConfig/> </div>
        <div> <ContractInfo/> </div>
      </div>
    </Layout>
  );
};

export default Initpage;