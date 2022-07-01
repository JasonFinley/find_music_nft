import Layout from "../components/Layout";
import { useContext, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useNetwork, chain } from "wagmi";

const Homepage = () => {

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center my-5">
        <div>Home Page</div>
      </div>
    </Layout>
  );
};

export default Homepage;