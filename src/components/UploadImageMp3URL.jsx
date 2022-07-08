
import { useEffect, useState, useContext } from 'react';
import Swal from 'sweetalert2'
import { useAccount, useConnect, useDisconnect, useContractRead, useContractWrite, useContractEvent } from "wagmi"
import { pinataPinMetaData, pinataPinFileByImageURL, pinataPinFileByMusicURL, pinataGetIPFSFillPath } from "../modules/pinata";
import ContextContractAddressABI from "../contexts/ContextContract";
import { v4 as uuidv4 } from 'uuid';

const UploadImageMp3URL = () => {

    const { data: account } = useAccount();

    const [ uploadImageURL, setUploadImageURL] = useState( "" );
    const [ uploadMp3URL, setUploadMp3URL] = useState( "" );

    const [ previewImage, setPreviewImage ] = useState("");
    const [ previewMp3, setPreviewMp3 ] = useState("");
    const [ songName, setSongName ] = useState("");

    const contractAddressABI = useContext( ContextContractAddressABI );

    const onChangeSongName = ( e ) => {
        setSongName( e.target.value );
    }

    const createMusicNFT = useContractWrite( 
        contractAddressABI,
        "createMusicNFT",
        { 
          onError(error){ console.log( error.message ); }
        }
      );

    const onChangeImage = ( e ) => {
        const file = e.target.files[0];
        setUploadImageURL( file );
    }
    const onChangeMp3 = ( e ) => {
        const file = e.target.files[0];
        setUploadMp3URL( file );
    }

    useEffect( () => {

        if( uploadImageURL ){
            const objectURL = URL.createObjectURL(uploadImageURL);
            setPreviewImage(objectURL);
            return () => URL.revokeObjectURL(objectURL);
        }

    }, [ uploadImageURL ] );

    useEffect( () => {

        if( uploadMp3URL ){
            const objectURL = URL.createObjectURL(uploadMp3URL);
            setPreviewMp3(objectURL);
            return () => URL.revokeObjectURL(objectURL);
        }

    }, [ uploadMp3URL ] );

    const getPreviewhtml = ( owner, songName, imageURL, audioURL, my_summary , my_lyric ) => {

        const previewString = 
        `<div>
            <div>
                <h3> ${ songName } </h3>
                <div>
                    <img src="${ imageURL }"/>
                </div>
                <audio src="${ audioURL }" type="audio/*" controls="controls" preload="metadata"/>
            </div>
            <div>
                <div>作者 : ${ owner }</div>
                <div>簡介 : ${ my_summary }</div>
                <div>歌詞 : ${ my_lyric }</div>
            </div>
        </div>`;
        return previewString;
    }

    const cidTOuuidString = ( cid ) => {
        const strRandomUUID = uuidv4( cid );
    //    let strUUID = strRandomUUID.replace("-", "").replace("-", "").replace("-", "").replace("-", "");
        const strUUID = strRandomUUID.replace("-", "");
        return strUUID;
    }

    const uploadDataToPinata = async ( creatorName, musicName, imageURL, musicURL, summary, lyric ) => {
        if( account ){


            Swal.fire( "Please waiting..." );

            const pinataImage = await pinataPinFileByImageURL( imageURL );
            const pinataMusic = await pinataPinFileByMusicURL( musicURL );

            const musicNFTUUID = cidTOuuidString( pinataMusic.data.IpfsHash );
            const musicNFTTokenID = parseInt( '0x' + musicNFTUUID, 16 );

            const fileName = musicName + ".json";
            const metaData = {
                    Creator : account?.address,
                    TokenID : musicNFTTokenID,
                    MusicName : musicName,
                    ImageURL : pinataGetIPFSFillPath( pinataImage.data.IpfsHash ),
                    MusicURL : pinataGetIPFSFillPath( pinataMusic.data.IpfsHash ),
                    Summary : summary,
                    Lyric : lyric,
                    create_time : new Date().toLocaleString().replace(',',''),
            };

            pinataPinMetaData( fileName, metaData ).then( ( pinataMetaData ) => {

                const ipfsMetaDataURL = pinataGetIPFSFillPath( pinataMetaData.data.IpfsHash );

                //上鏈..
                console.log( "setting data : ", ipfsMetaDataURL );
                createMusicNFT.write( { args : [ musicNFTTokenID, ipfsMetaDataURL ] } );
                Swal.close();

            });

        }else{
            Swal.fire( "請連接MetaMask" );
        }
    }

    const onBtnPreview = () => {

        const my_summary = document.querySelector("#customer_summary").value;
        const my_lyric = document.querySelector("#customer_lyric").value;
        const my_preview_html = getPreviewhtml( account?.address, songName, previewImage, previewMp3, my_summary, my_lyric );

        Swal.fire({
            title : '預覽',
            html: my_preview_html,
            showCancelButton: true,
            confirmButtonText: 'UpLoad',
        }).then( (result) => {
            if( result.isConfirmed ){
                console.log( "isConfirmed = true :", result );
                uploadDataToPinata( account?.address, songName, previewImage, previewMp3, my_summary, my_lyric );
            }
        });
    }

    return (
        <div>
            <div>
                <h4>請選擇圖檔 : </h4>
                <input type="file" accept="image/*" onChange={ onChangeImage }/>
            </div>
            <div>
                <h4>請選擇音樂 : </h4>
                <input type="file" accept="audio/*" onChange={ onChangeMp3 }/>
            </div>
            <div>
                <h4>請輸入歌曲名 : </h4>
                <input type="text" onChange={ onChangeSongName }/>
            </div>
            <div>
                <h4>請輸入簡介 : </h4>
                <textarea   id="customer_summary"
                            name="mysummary"
                            rows="6"
                            cols="40"/>
            </div>
            <div>
                <h4>請輸入歌詞 : </h4>
                <textarea   id="customer_lyric"
                            name="mylyric"
                            rows="10"
                            cols="40"/>
            </div>
            <button onClick={ onBtnPreview }> 預覽 </button>
        </div>
    );
};

export default UploadImageMp3URL;