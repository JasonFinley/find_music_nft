import Layout from "../components/Layout";
import { useContext, useEffect, useState } from 'react';
import { useAccount, useBalance, useContractRead } from "wagmi";
import ContextContractAddressABI from "../contexts/ContextContract";
import MusicNFTCard from "../components/MusicNFTCard";
import { pinataGetMetaData } from "../modules/pinata";
import { useParams } from "react-router-dom";

const Viewuserpage = () => {

  const { creatorAddress } = useParams();
  const contractAddressABI = useContext( ContextContractAddressABI );

  const [ musicNFTData, setMusicNFTData ] = useState([]);
  const [contractMusicNFTMetaData, setContractMusicNFTMetaData] = useState([]);

  const [ creatorMetaDataURL, setCreatorMetaDataURL] = useState();
  const [ creatorData, setCreatorData] = useState();

  const getCreatorDataFromURL = async ( dataURL ) => {
    console.log( dataURL );
    await pinataGetMetaData( dataURL.MetaDataURL ).then( ( res ) => {
      console.log( res );
      setCreatorData( {
        Creator : dataURL.Creator,
        CreatorName : res.username,
        Summary : res.information,
        ImageURL : res.image_url
      } );
    });
  }

  useEffect( () => {

    if( creatorMetaDataURL ){
      getCreatorDataFromURL( creatorMetaDataURL );
    }

  }, [ creatorMetaDataURL ]); 

  const getCoreatorMetaDataURLFromContract = ( result ) => {
    console.log( result );
    setCreatorMetaDataURL( {
      Creator : result.creator,
      MetaDataURL : result.dataURL,
    });
  }

  const getCreatorData = useContractRead(
    contractAddressABI,
    "getCreatorData",
    { 
      args : [ creatorAddress ],
      watch : true,
      onSuccess : ( result ) => { getCoreatorMetaDataURLFromContract( result ) },
    }
  );

  const parseMusicNFTFromContractMetaData = async ( result ) => {
    const MusicNFT = [];
    for( let i = 0 ; i < result.length ; i++ )
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
      args : [ creatorAddress ],
      watch : true,
      onSuccess : ( result ) => { getMusicNFTDataFromContract( result ) }
    }
  );

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div>
          <img src={ creatorData?.ImageURL }/>
          <div>
            <h3>錢包:{ creatorData?.Creator } </h3>
            <h3>姓名:{ creatorData?.CreatorName } </h3>
            <div>簡介: { creatorData?.Summary } </div>
          </div>
        </div>
        <h3>創作音樂集</h3>
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

export default Viewuserpage;