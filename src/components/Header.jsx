import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

import { useAccount, useConnect, useDisconnect, useBalance, useNetwork, chain } from "wagmi";

const StyledHeader = styled.header`
  background: rgb(21, 21, 21);
  .nav-link {
    padding: 16px 8px;
    text-decoration: none;
    color: white;
  }
  .btn_login{
    margin: auto;
  }
`;

const Header = () => {

  const { data: account } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors, error, isConnecting, pendingConnector } = useConnect();

  const { activeChain, switchNetwork } = useNetwork({ chainId: chain.localhost.id });

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.localhost.id) {
      switchNetwork(chain.localhost.id);
    }
  }, [activeChain, switchNetwork]);

  return (
    <StyledHeader>
      <div className="container">
        <div className="row ">
          <div className="col-10">
            <nav className="d-flex">
              <Link className="nav-link" to="/">首頁</Link>
              <Link className="nav-link" to="/user">個人</Link>
              <Link className="nav-link" to="/upload">創作</Link>
              <Link className="nav-link" to="/setting">設定</Link>
              <Link className="nav-link" to="/contract">合約狀態</Link>
            </nav>
          </div>
          <div className="col-2 btn_login">
            { account? (
                <button onClick={ disconnect }>取消連結</button>
              ):(
                <div>
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
          </div>
        </div>
      </div>
    </StyledHeader>
  );
};

export default Header;