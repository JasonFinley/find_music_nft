import $ from 'jquery';
// 文本翻译 API 简介
// https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html
const YOUDAO_API_URL = 'http://openapi.youdao.com/api';
const YOUDAO_APP_KEY = process.env.REACT_APP_YOUDAO_APP_KEY;
const YOUDAO_SEC_KEY = process.env.REACT_APP_YOUDAO_SEC_KEY;

function truncate( q ){
    let len = q.length;
    if( len <= 20 ) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
  }

function translate( text, callback ){

  if( text.toString().length <= 0 )
    text = "機器人畫圖";
  
  const currentTime = new Date().getTime();
  const CryptoJS = require("crypto-js");
  
  const appKey = YOUDAO_APP_KEY;
  const secKey = YOUDAO_SEC_KEY;//注意：暴露appSecret，有被盗用造成损失的风险
  const salt = currentTime;
  const curTime = Math.round( currentTime / 1000 );
  const query = text;
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  const from = 'zh-CHT';
  const to = 'en';
  const sign_str = appKey + truncate(query) + salt + curTime + secKey;
  const sign = CryptoJS.SHA256( sign_str ).toString(CryptoJS.enc.Hex);
  
  $.ajax({
    url: YOUDAO_API_URL,
    type: 'post',
    dataType: 'jsonp',
    data: {
      q: query,
      appKey: appKey,
      salt: salt,
      from: from,
      to: to,
      sign: sign,
      signType: "v3",
      curtime: curTime,
    },
    success: function (data) {
      console.log( "translate : ", text, " => ",data.translation);
      if( callback )
        callback( data.translation );
    },
    error: function (thrownError) {
      console.log( "youdao Server thrownError : ", thrownError );
    }
  });
}

const youdaoTranslate = ( text, callback ) => {
  translate( text, callback );
}

export default youdaoTranslate;
