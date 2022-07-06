import Layout from "../components/Layout";
import { useContext, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useNetwork, chain } from "wagmi";
import MusicNFTCard from "../components/MusicNFTCard";

const Userpage = () => {

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div>
            <MusicNFTCard songName={ "My Song" }
                          owner={ "Jason" }
                          imageURL={ "https://picsum.photos/256/256" }
                          audioURL={ "https://ipfs.io/ipfs/QmNVECLuxEgfb3E6GmcAXzXDbt7hqWJzYW8qQoVcav9bni/animation.mpga" }
                          summary={ "my summary" }
                          lyric={ "my lyric" }
            />
          </div>
      </div>
    </Layout>
  );
};

export default Userpage;