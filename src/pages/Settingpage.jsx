import Layout from "../components/Layout";
import { useEffect, useState, useContext } from 'react';
import { useAccount, useContractWrite } from "wagmi";
import hotpotGetImageFromText from "../modules/Hotpot";
import { pinataPinMetaData, pinataPinFileByImageURL, pinataGetIPFSFillPath } from "../modules/pinata";
import Swal from 'sweetalert2'
import ContextContractAddressABI from "../contexts/ContextContract";

const Settingpage = () => {

    const contractAddressABI = useContext( ContextContractAddressABI );
    const [ username, setUsername ] = useState( );
    const [ summary, setSummary ] = useState();
    const [ userImageFile, setUserImageFile ] = useState("");
    const [ userImageURL, setUserImageURL ] = useState("");
    const [ imageURLMethod, setImageURLMethod ] = useState( "upload" );
    const [ aiDrawText, setAiDrawText ] = useState( "robot is drawing" );

    const { data : account } = useAccount();

    const onChangeFile = ( e ) => {
        const file = e.target.files[0];
        setUserImageFile( file );    
    }

    useEffect( () => {

        if( userImageFile ){
            const objectURL = URL.createObjectURL(userImageFile);
            setUserImageURL(objectURL);
            return () => URL.revokeObjectURL(objectURL);
        }

    }, [ userImageFile ] );

    const onChangeMethod = ( e ) => {
        setImageURLMethod( e.target.value );
    }

    const onChangeText = ( e ) => {
        setAiDrawText( e.target.value );
    }

    const onChangeName = ( e ) => {
        setUsername( e.target.value );
    }

    const onChangeSummary = ( e ) => {
        setSummary( e.target.value );
    }

    const btnAIDraw = () => {

        Swal.showLoading();
        hotpotGetImageFromText( aiDrawText, ( imgURL ) => {
            setUserImageURL( imgURL );
            Swal.close();
        } );
    }

    const setCreatorWhiteListData = useContractWrite(
        contractAddressABI,
        "setCreatorWhiteListData",
        {
            onError(error){ console.log( error.message ); }
        }
    );

    const btnClick = () => {
        if( account ){

            Swal.showLoading();

            pinataPinFileByImageURL( userImageURL ).then( ( imageResponse ) => {

                let ipfsImageCID = imageResponse.data.IpfsHash;
                const ipfsImageURL = pinataGetIPFSFillPath( ipfsImageCID );
                let pinataFileName = account.address.toString() + '.json';
                pinataPinMetaData( pinataFileName, {

                    image_cid : ipfsImageCID.toString(),
                    username : username,
                    information : summary,
                    create_time : new Date().toLocaleString().replace(',',''),
                    image_url : ipfsImageURL,

                } ).then( ( metaDataResponse ) => {

                    let ipfsMetaDataCID = metaDataResponse.data.IpfsHash;
                    //            console.log( "onBtnMetaData - pinata : file CID =", ipfsMetaDataCID );
                    const ipfsMetaDataURL = pinataGetIPFSFillPath( ipfsMetaDataCID );
                    //            console.log( ipfsMetaDataURL );
                    
                    //??????..
                    console.log( "setting data : ", ipfsMetaDataURL );
                    setCreatorWhiteListData.write({ args : [ ipfsMetaDataURL ] });

                    Swal.close();
                } );
            } );

        }else{
            Swal.fire({ title : "?????????MetaMask..!!" });
        }
    }    

    return (
        <Layout>
            <div className="d-flex flex-column align-items-center justify-content-center">
                <h3>??????????????????</h3>
                <h4>???????????? : { account? account.address : "???????????????" }</h4>
                <div>
                    <div>
                        <div>
                            <label>????????????:</label>
                        </div>
                        <div>
                            <label><input type="radio" name="imageURL" value="upload" onChange={ onChangeMethod } checked={ imageURLMethod === "upload" }/> ???????????????</label>
                            <label><input type="radio" name="imageURL" value="aidraw" onChange={ onChangeMethod } checked={ imageURLMethod === "aidraw" }/> AI ?????????</label>
                        </div>
                        <div>
                            { imageURLMethod==="upload" ? (
                                    <input type="file" accept="image/*" onChange={ onChangeFile }/>
                                ):(
                                    <div>
                                        <input type="text" onChange={ onChangeText }/>
                                        <button onClick={ btnAIDraw }> AI Draw </button>
                                    </div>
                                )
                                
                            }
                        </div>
                    </div>
                    <div>
                        <div>
                            <img src={ userImageURL } />
                        </div>
                        <div>??????</div>
                        <input type="text" onChange={ onChangeName }/>
                        <div>??????</div>
                        <input type="text" onChange={ onChangeSummary }/>
                    </div>
                    <button onClick={ btnClick }>??????</button>
                </div>
            </div>
        </Layout>
    );
};

export default Settingpage;