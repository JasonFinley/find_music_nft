import Layout from "../components/Layout";
import { useContext, useEffect, useState } from 'react';
import { useAccount, useBalance, useContractRead } from "wagmi";
import ContextContractAddressABI from "../contexts/ContextContract";
import MusicNFTCard from "../components/MusicNFTCard";
import { pinataGetMetaData } from "../modules/pinata";

const Userpage = () => {

  const { data : account } = useAccount();
  const { data: accountBalance, isError : isErrorBalance, isLoading : isLoadingBalance } = useBalance( { addressOrName: account?.address, } );
  const contractAddressABI = useContext( ContextContractAddressABI );

  const [ musicNFTData, setMusicNFTData ] = useState([]);

  const [contractMusicNFTMetaData, setContractMusicNFTMetaData] = useState([]);

  const parseMusicNFTFromContractMetaData = async ( result ) => {
    const MusicNFT = [];
    for( let i = 0 ; i < result?.length ; i++ )
    {
        await pinataGetMetaData( result[i].MusicNFTMetaURL ).then( ( res ) => {
          MusicNFT.push({
            TokenID : result[i].MusicNFTTokenID,
            Creator : res.Creator,
            MusicName : res.MusicName,
            Summary : res.Summary,
            Lyric : res.Lyric,
            ImageURL : res.ImageURL,
            MusicURL : res.MusicURL,
          });
        });
    }

    setMusicNFTData( MusicNFT );
  }

  useEffect( () => {

    if( contractMusicNFTMetaData ){
      parseMusicNFTFromContractMetaData( contractMusicNFTMetaData );
    }

  }, [ contractMusicNFTMetaData ]);

  const getMusicNFTDataFromContract = ( result ) => {

//    console.log(result  );
    const newRes = result?.map( (item) => {
      return {
        Creator : item.creator,
        MusicNFTTokenID : item.tokenID.toNumber(),
        MusicNFTMetaURL : item.metaURL,
      }
    } );

    setContractMusicNFTMetaData( newRes );
  }

  const getMusicNFTByOwner = useContractRead(
    contractAddressABI,
    "getMusicNFTByOwner",
    { 
      args : [ account?.address ],
      watch : true,
      onSuccess : ( result ) => { getMusicNFTDataFromContract( result ) }
    }
  );

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div>
          <h3>錢包: { account? ( account.address ):( "請連接MetaMask" ) }</h3>
          <h3>餘額: { accountBalance?.formatted } { accountBalance?.symbol }</h3>
        </div>
        <div className="row">
          {
            musicNFTData?.map( ( item ) => { 
              return ( 
                <MusicNFTCard className="col"
                  key={ item.TokenID }
                  songName = { item.MusicName }
                  owner={ item.Creator }
                  imageURL={ item.ImageURL }
                  audioURL={ item.MusicURL }
                  summary={ item.Summary }
                  lyric={ item.Lyric }
                />
              )
             } )
          }
        </div>
      </div>
    </Layout>
  );
};

export default Userpage;