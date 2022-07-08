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
    for( let i = 0 ; i < result.length ; i++ )
    {
      console.log( result[i] );
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

    console.log(result  );
    const newRes = result.map( (item) => {
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
        <div>
          {
            musicNFTData?.map( ( item ) => { 
              return ( 
                <MusicNFTCard key={ item.TokenID } 
                  owner={ item.Creator }
                  imageURL={ item.ImageURL }
                  audioURL={ item.MusicURL }
                  summary={ item.Summary }
                  lyric={ item.Lyric }
                />
              )
             } )
          }
          {/*
            <MusicNFTCard songName={ "My Song" }
                          owner={ "Jason" }
                          imageURL={ "https://picsum.photos/256/256" }
                          audioURL={ "https://ipfs.io/ipfs/QmNVECLuxEgfb3E6GmcAXzXDbt7hqWJzYW8qQoVcav9bni/animation.mpga" }
                          summary={ "my summary" }
                          lyric={ "my lyric" }
            />*/
          }
            
        </div>
      </div>
    </Layout>
  );
};

export default Userpage;