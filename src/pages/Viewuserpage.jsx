import Layout from "../components/Layout";
import { useContractRead } from "wagmi";
import { useContext, useEffect, useState } from 'react';
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
    await pinataGetMetaData( dataURL?.MetaDataURL ).then( ( res ) => {
      setCreatorData( {
        Creator : dataURL.Creator,
        CreatorName : res.username,
        Summary : res.information,
        ImageURL : res.image_url
      } );
    }).catch( (err) => {console.log(err)} );
  }

  useEffect( () => {

    if( creatorMetaDataURL ){
      getCreatorDataFromURL( creatorMetaDataURL );
    }

  }, [ creatorMetaDataURL ]); 

  const getCoreatorMetaDataURLFromContract = ( result ) => {
    setCreatorMetaDataURL( {
      Creator : result?.creator,
      MetaDataURL : result?.dataURL,
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
    for( let i = 0 ; i < result?.length ; i++ )
    {
      if( result[i] ){
        await pinataGetMetaData( result[i].MusicNFTMetaURL ).then( ( res ) => {
          MusicNFT.push({
            TokenID : result[i].MusicNFTTokenID,
            Creator : res.creator,
            MusicName : res.name,
            Summary : res.description,
            Lyric : res.lyric,
            ImageURL : res.image,
            MusicURL : res.animation_url,
          });
        });
      }
    }

    setMusicNFTData( MusicNFT );
  }

  useEffect( () => {

    if( contractMusicNFTMetaData ){
      parseMusicNFTFromContractMetaData( contractMusicNFTMetaData );
    }

  }, [ contractMusicNFTMetaData ]);

  const getMusicNFTDataFromContract = ( result ) => {

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
      args : [ creatorAddress ],
      watch : true,
      onSuccess : ( result ) => { getMusicNFTDataFromContract( result ) }
    }
  );

  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div>
          <h2>創作者 :{ creatorData?.CreatorName } </h2>
          <img src={ creatorData?.ImageURL }/>
          <div>
            <h3>錢包:{ creatorData?.Creator } </h3>
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