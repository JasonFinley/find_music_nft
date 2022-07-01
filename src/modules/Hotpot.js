//import axios from "axios";
import $ from "jquery";

const HOTPOT_API_URL = 'https://cortex.hotpot.ai/latent-test';
const HOTPOT_S3_URL = 'https://hotpotmedia.s3.us-east-2.amazonaws.com/';

function createAlphanumericString( length ){
    return createRandomString( "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", length );
}

function createRandomString( characterString, length ){
    let text="";
    for( let i = 0 ; i < length ; i++ )
    {
        text += characterString.charAt( Math.floor( Math.random()*characterString.length ) );
    }
    return text;
}

function isDefined( value ){
    return typeof value!=="undefined" && value!==null;
}

function createRequestId(serviceId) {
  let requestId = createAlphanumericString(15);

  if (isDefined(serviceId)) {
    requestId = serviceId + '-' + requestId;
  }

  return requestId;
}

function getS3ImageUrl(filename, type) {
    // Set file extension.
    let ext = 'png';
    if (type === 'jpg' || type === 'jpeg') {
      ext = 'jpg';
    }
  
    let fullFilename = filename + '.' + ext;
  
    return HOTPOT_S3_URL + fullFilename;//`https://hotpotmedia.s3.us-east-2.amazonaws.com/${fullFilename}`;
}

function getFormData( text ) {
  // Set default value.
  let formData = {};

  // Get form values.
  let inputText = text;
  let outputWidth = "256";
  let outputHeight = "256";
  let numIterations = "200";
  let style = "hotpotArt1";
  let styleLabel = "Hotpot Art 1";
  let substyle = null;

  // Set randomize value?
  formData['isRandom'] = true;

  // Update @formData.
  formData['inputText'] = inputText;
  formData['outputWidth'] = outputWidth;
  formData['outputHeight'] = outputHeight;
  formData['numIterations'] = numIterations;
  formData['style'] = style;
  formData['substyle'] = substyle;
  formData['styleLabel'] = styleLabel;

  return formData;
}


function getRequestData( text ) {
  // Get form data.
    let HotpotServiceId = 8;

    let data = getFormData( text );

    // Add request ID.
    let requestId = createRequestId(HotpotServiceId);
    data['requestId'] = requestId;

    // Add result URL?
    data['resultUrl'] = getS3ImageUrl(requestId);

    return data;
}

function requestDataToFormData(requestData){
  let formData = new FormData();
  for( const[key,value] of Object.entries(requestData) )
  {
      formData.append(key,value);
  }
  return formData;
}

function doServerRequest( text, callback ) {
  // Get request data.
  let requestData = getRequestData( text );
  
  // Request data -> form data.
  let formData = requestDataToFormData(requestData);

  // Set server URL.
  let serverUrl = HOTPOT_API_URL;//'https://cortex.hotpot.ai/latent-test'

  // Set request settings.
  let settings = {
    url: serverUrl,
    method: 'POST',
    timeout: 0,
    contentType: false,
    processData: false,
    data: formData,
    success: function (response) {
      console.log( "hotpot Server response : ", response );
      console.log( "hotpot Server responseID : ", response.requestId );
      callback( getS3ImageUrl(response.requestId) );
    },
    error: function (thrownError) {
      console.log( "hotpot Server thrownError : ", thrownError );
    }
  };

  try {
    $.ajax(settings);
  } catch (error) {
    console.log( error );
//    return null;
  }
}

const hotpotGetImageFromText = ( text, callback ) => {
    if( text.toString().length <= 0 ){
        text = "robot is drawing";
        console.log( "hotpotGetImageFromText : no input...use default ", text );
    }
    doServerRequest( text, callback );
}

export default hotpotGetImageFromText;
