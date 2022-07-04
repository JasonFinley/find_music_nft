import Layout from "../components/Layout";
import { useContext, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useNetwork, chain } from "wagmi";

const Userpage = () => {

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div>user page</div>
      </div>
    </Layout>
  );
};

export default Userpage;