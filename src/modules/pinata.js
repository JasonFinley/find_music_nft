import Axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

const URL_TEST_AUTHENTICATION = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

const URL_PINATA_CLOUD_IPFS = 'https://gateway.pinata.cloud/ipfs/';// + 'CID'
const URL_PIN_FILE_TO_IPFS = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const URL_PIN_METADATA_TO_IPFS = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export function pinataGetIPFSPath(){ return URL_PINATA_CLOUD_IPFS; }
export function pinataGetIPFSFillPath( CID ){ return URL_PINATA_CLOUD_IPFS + CID; }

export async function pinataPinFileBySRC( src_uri, ext ){

    let response = null;
    let file_name = uuidv4( src_uri ) + ext;

    try{
        const res = await fetch( src_uri );
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

export async function pinataGetMetaData( dataURL ){

    const config = {
        method: 'get',
        url: dataURL,
        headers: { 
            'Content-Type': 'application/json'
        }
    };
    
    let pinataMetaData;

    try{
        const response = await Axios( config );
//        console.log( "pinataGetMetaData : response =", response );
//        console.log( "pinataGetMetaData : response.data =", response.data );
        pinataMetaData = JSON.parse( response.data.ContentData );
//        console.log( "pinataGetMetaData : response JSON to Obj =", image_info );

    } catch( error ) {
        console.log( error );
    }
    return pinataMetaData;
}

export async function pinataPinMetaData( objName, objData ){

    const jsonObjData = JSON.stringify( objData );

    const pinataData = {
        "pinataOptions" : { "cidVersion" : 1 },
        "pinataMetadata" : {
            "name" : objName, 
        },
        "pinataContent" : {
            "ContentData" : jsonObjData,
        }
    }

    const jsonPinataMetaData = JSON.stringify( pinataData );
   
    const config = {
      method: 'post',
      url: URL_PIN_METADATA_TO_IPFS,
      headers: { 
        'pinata_api_key' : PINATA_API_KEY,
        'pinata_secret_api_key' : PINATA_API_SECRET,
        'Content-Type': 'application/json'
      },
      data: jsonPinataMetaData,
    };

    try{
        const response = await Axios( config );
        return response;
    } catch ( err ) {
        console.log( err );
    }

}

export function pinataPinFileByImageURL( url ){
    return pinataPinFileBySRC( url, ".png" );
}

export function pinataPinFileByMusicURL( url ){
    return pinataPinFileBySRC( url, ".mp3" );
}

export function pinataPinFile( path_file ){
    return pinataPinFileBySRC( path_file );
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

