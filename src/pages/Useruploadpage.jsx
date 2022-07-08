import Layout from "../components/Layout";
import { useContext, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useNetwork, chain } from "wagmi";
import UploadImageMp3URL from "../components/UploadImageMp3URL";

const Useruploadpage = () => {

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h2> Music NFT 創作</h2>
        <UploadImageMp3URL/>
      </div>
    </Layout>
  );
};

export default Useruploadpage;