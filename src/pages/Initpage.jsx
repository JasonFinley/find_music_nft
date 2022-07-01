import Layout from "../components/Layout";
import { useContext, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useNetwork, chain } from "wagmi";
import { PinataConfigContext } from "../contexts/PinataConfigContext"
import PinataConfig from "../components/PinataConfig";

const Initpage = () => {

  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();
  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: accountBalance, isError : isErrorBalance, isLoading : isLoadingBalance } = useBalance( { addressOrName: account?.address, } );
  const { activeChain, switchNetwork } = useNetwork({ chainId: chain.rinkeby.id });
  const pinataContext = useContext( PinataConfigContext );

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.rinkeby.id) {
      switchNetwork(chain.rinkeby.id);
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
        <div>
          <PinataConfig/>
        </div>
        <div>
          <div>myContextKey = { pinataContext?.PINATA.API_KEY }</div>
          <div>myContextSecret = { pinataContext?.PINATA.API_SECRET }</div>
        </div>
      </div>
    </Layout>
  );
};

export default Initpage;