import Axios from "axios";
import { v4 as uuidv4 } from 'uuid';

//pinata, google
//帳號 : kryptocampbatch3team2@gmail.com
//密碼 : Batch3@Final@Project@Team2
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

const URL_TEST_AUTHENTICATION = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

const URL_PINATA_CLOUD_IPFS = 'https://gateway.pinata.cloud/ipfs/';// + 'CID'
const URL_PIN_FILE_TO_IPFS = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const URL_PIN_METADATA_TO_IPFS = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export function pinataGetIPFSPath(){ return URL_PINATA_CLOUD_IPFS; }
export function pinataGetIPFSFillPath( CID ){ return URL_PINATA_CLOUD_IPFS + CID; }

export async function pinataPinFileBySRC( image_src ){

    let response = null;
    let file_name = uuidv4( image_src ) + ".png";

    try{
        const res = await fetch( image_src );
        const blob = await res.blob();

        const FormData = require( 'form-data' );
        let form = new FormData();
        form.append( "file", blob, file_name );

        const header = {
            'Content-Type': `multipart/form-data; boundary= ${form._boundary}`,
            'pinata_api_key' : PINATA_API_KEY,
            'pinata_secret_api_key' : PINATA_API_SECRET,
        };
        response = await Axios.post( URL_PIN_FILE_TO_IPFS, form, { headers : header } );

    } catch ( error ) {
        console.log( error );
    }

    return response;
}

export async function pinataGetMetaData( meta_data_url ){

    const config = {
        method: 'get',
        url: meta_data_url,
        headers: { 
            'Content-Type': 'application/json'
        }
    };
    
    let image_info;

    try{
        const response = await Axios( config );
//        console.log( "pinataGetMetaData : response =", response );
//        console.log( "pinataGetMetaData : response.data =", response.data );
        image_info = JSON.parse( response.data.imageData );
//        console.log( "pinataGetMetaData : response JSON to Obj =", image_info );

    } catch( error ) {
        console.log( error );
    }
    return image_info;
}

export async function pinataPinMetaData( meta_data ){

    const image_info_json = JSON.stringify( meta_data.image_info );

    const pinataData = {
        "pinataOptions" : { "cidVersion" : 1 },
        "pinataMetadata" : {
            "name" : meta_data.file_name, 
        },
        "pinataContent" : {
            "imageData" : image_info_json,
        }
    }

    const json_meta_data = JSON.stringify( pinataData );
   
    const config = {
      method: 'post',
      url: URL_PIN_METADATA_TO_IPFS,
      headers: { 
        'pinata_api_key' : PINATA_API_KEY,
        'pinata_secret_api_key' : PINATA_API_SECRET,
        'Content-Type': 'application/json'
      },
      data: json_meta_data,
    };

    console.log( "meta_data =", meta_data );
    console.log( "json_meta_data =", json_meta_data );
//    console.log( "config =", config );

    try{
        const response = await Axios( config );
        return response;
    } catch ( err ) {
        console.log( err );
    }

}

export function pinataPinFileByUrl( url ){
    return pinataPinFileBySRC( url );
}

export function pinataPinFile( path_file ){
    return pinataPinFileBySRC( path_file );
/*
    const fs = require('fs');
    let form = new FormData();
    form.append( 'file', fs.createReadStream( path_file ));
    const url = URL_PIN_FILE_TO_IPFS;
    const header = {
        'Content-Type': `multipart/form-data; boundary= ${form._boundary}`,
        'pinata_api_key' : PINATA_API_KEY,
        'pinata_secret_api_key' : PINATA_API_SECRET,
    };

    Axios.post( url, form, { headers : header } ).then( ( res ) => { 
        console.log( res );
     } ).catch( ( error ) => {
        console.log( error );
     });*/
}

export function pinataTestAuthentication(){
    const config = {
        method: 'get',
        url: URL_TEST_AUTHENTICATION,
        headers: { 
            'pinata_api_key' : PINATA_API_KEY,
            'pinata_secret_api_key' : PINATA_API_SECRET,
        }
    };

    Axios( config ).then( ( res ) => { 
        console.log( res );
     } ).catch( ( error ) => {
        console.log( error );
     });
}

