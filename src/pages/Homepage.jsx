import Layout from "../components/Layout";
import { useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useContractRead, useContractWrite, useContractEvent } from "wagmi"
import CreatorCard from "../components/CreatorCard";
import ContextContractAddressABI from "../contexts/ContextContract";

const Homepage = () => {

  const contractContext = useContext( ContextContractAddressABI );
  const { data : account } = useAccount();
  const [ addWallet, setAddWallet ] = useState( "" );

  const getContractOwner = useContractRead( 
    contractContext,
    "getContractOwner",
    { watch : true }
  );

  const setContractAddWhiteList = useContractWrite( 
    contractContext,
    "addCreatorWhitelist",
    { 
      onError(error){ console.log( error.message ); }
    }
  );


  const btnAddWhiteList = () => {
    setContractAddWhiteList.write({
      args : [ addWallet ]
    });
  }

  const onChangeAddWellet = ( e ) => {
    setAddWallet( e.target.value );
  }

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h1>Music NFT</h1>
        <div>給玩音樂的自由創作者上鏈的小地方</div>
        <div>想要如何玩音樂，就如何玩</div>
        <div>說不定玩一玩，還能賣音樂賺錢 !! Who knows</div>
        <div>加入白名單開始請
          <a href="mailto:jasonfinley821@gmail.com"><u><font color="red">連絡站長</font></u></a>，
          並提供MetaMask錢包地址
        </div>
        <div>關於本站有任何想法請<a href="mailto:jasonfinley821@gmail.com"><u><font color="red">連絡站長</font></u></a></div>
        <div>目前本站會在Rinkeby測試鏈，所以 ALL Free!!</div>
        { getContractOwner?.data?.toString() === account?.address?.toString() ?
          (
            <div>
              <input type="text" onChange={ onChangeAddWellet }/><button onClick={ btnAddWhiteList }>新增創作者白名單</button>
            </div>
          ):(
            <div>
              <input type="text" disabled/><button disabled>新增創作者白名單</button>
            </div>
          )
        }
        <h3>創作者</h3>
        <div>
          <CreatorCard  creator={ "jason" }
                        creatorURL={ "https://picsum.photos/256/256" }
                        summary={ "my summary" }
          />
        </div>
      </div>
    </Layout>
  );
};

export default Homepage;