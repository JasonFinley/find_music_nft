import Layout from "../components/Layout";
import { useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useContractRead, useContractWrite, useContractEvent } from "wagmi"
import CreatorCard from "../components/CreatorCard";
import ContextContractAddressABI from "../contexts/ContextContract";
import { pinataGetMetaData } from "../modules/pinata";
import { generatePath, useNavigate, Link } from "react-router-dom";

const Homepage = () => {
  const navigation = useNavigate();

  const contractAddressABI = useContext( ContextContractAddressABI );
  const { data : account } = useAccount();
  const [ addWallet, setAddWallet ] = useState( "" );

  const [ creatorMetaDataURL, setCreatorMetaDataURL ] = useState([]);
  const [ creatorData, setCreatorData ] = useState([]);

  const getContractOwner = useContractRead( 
    contractAddressABI,
    "getContractOwner",
    { watch : true }
  );

  const setContractAddWhiteList = useContractWrite( 
    contractAddressABI,
    "addCreatorWhitelist",
    { 
      onError(error){ console.log( error.message ); }
    }
  );

  const getCoreatorMetaDataURLFromContract = ( result ) => {
    const newRes = result?.map( (item) => {
      return {
        Creator : item.creator,
        MetaDataURL : item.dataURL,
      }
    });
    setCreatorMetaDataURL( newRes );
  }

  const getCreatorDataFromURL = async ( dataURL ) => {

    const creatorData = [];
    for( let i = 0 ; i < dataURL?.length ; i++ )
    {
        await pinataGetMetaData( dataURL[i].MetaDataURL ).then( ( res ) => {
//          console.log( res );
          creatorData.push({
            Creator : dataURL[i].Creator,
            CreatorName : res.username,
            Summary : res.information,
            ImageURL : res.image_url
          });
        });
    }

    setCreatorData( creatorData );

  }

  useEffect( () => {

    if( creatorMetaDataURL ){
      getCreatorDataFromURL( creatorMetaDataURL );
    }

  }, [ creatorMetaDataURL ]);

  const getWhiteListData = useContractRead(
    contractAddressABI,
    "getWhiteListData",
    { 
      watch : true,
      onSuccess : ( result ) => { getCoreatorMetaDataURLFromContract( result ) },
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

  const btnDebugLog = () => {
//    console.log( navigation );
//    const path = generatePath( "/viewuser/0xf8789AB568eC6155Eb3F9056144346590dbF14cc");
//    navigation( path);
  }

  const onClickGoToCreator = ( addressCreator ) => {
    const base_path = addressCreator? ( "/viewuser/" + addressCreator.toString() ) : ( "/user" );
    const path = generatePath( base_path );
    navigation( path );
  }

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <h1>Find Music NFT</h1>
        <div>給玩音樂的自由創作者上鏈的小地方</div>
        <div>想要如何玩音樂，就如何玩</div>
        <div>說不定玩一玩，還能創作音樂賺錢 !! Who knows</div>
        <div>Follow OpeaSea MetaData !!</div>
        
        <ul> <h3> 目前想法 : </h3>
          <li>原創者 - 創作音樂曲目並上傳到IPFS, 區塊鏈記錄相關資訊。</li>
          <li>類創作者 - 購買原創者的音樂或版權。再自行創作或合成新曲風之類的。</li>
          <li>粉絲 - 購買創作者的音樂或版權。</li>
        </ul>

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
        <div className="row">
          {
            creatorData?.map( (item) => {
                return (
                  <Link to={ "/viewuser/"+item?.Creator }>
                    <CreatorCard className="col"
                              key={ item.Creator }
                              creatorAddress={ item.Creator }
                              creatorName={ item.CreatorName }
                              creatorURL={ item.ImageURL }
                              summary={ item.Summary }
                    />
                  </Link>
                )
            } )
          }
          {
            /*<div>
              <CreatorCard  creator={ "jason" }
                            creatorURL={ "https://picsum.photos/256/256" }
                            summary={ "my summary" }
              />
              <button onClick={btnDebugLog}> LOG </button>
            </div>*/
          }
        </div>
      </div>
    </Layout>
  );
};

export default Homepage;