
import { useEffect, useState } from 'react';
import MusicNFTCard from './MusicNFTCard';
import Swal from 'sweetalert2'
import { findMatchingRequiredOptions } from 'web3modal';

const UploadImageMp3URL = () => {

    const [ uploadImageURL, setUploadImageURL] = useState( "" );
    const [ uploadMp3URL, setUploadMp3URL] = useState( "" );

    const [ previewImage, setPreviewImage ] = useState("");
    const [ previewMp3, setPreviewMp3 ] = useState("");

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

    const onBtnPreview = () => {

        const my_summary = document.querySelector("#customer_summary").value;
        const my_lyric = document.querySelector("#customer_lyric").value;
        const my_preview_html = getPreviewhtml("jason", "my song", previewImage, previewMp3, my_summary, my_lyric );

        Swal.fire({
            title : '預覽',
            html: my_preview_html,
            showCancelButton: true,
            confirmButtonText: 'UpLoad',
        }).then( (result) => {
            if( result.isConfirmed ){
                console.log( "isConfirmed = true :", result );
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