import { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { ContextPinataConfig } from '../contexts/ContextPinataConfig';

const PinataConfig = () =>{

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [api_kay, setAPIKey] = useState( "" );
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [api_secret, setAPISecret] = useState( "" );
    const pinataConfigContext = useContext( ContextPinataConfig );
    function ApiKeyChange( el ){ setAPIKey( el.target.value ); }
    function ApiSecretChange( el ){ setAPISecret( el.target.value ); }

    const pinataConfirm = () => {
        let isDone = false;
        if( api_kay.length > 0 && api_secret.length > 0 ){
            pinataConfigContext.PINATA_SET_APIKEY( api_kay, api_secret );
            isDone = true;
        }else if( pinataConfigContext.PINATA.API_KEY && pinataConfigContext.PINATA.API_SECRET ){
            console( "Use default .env .....!!" );
            isDone = true;
        }else{
            Swal.fire("please input your pinata api key and api secret. i dont save your key!!");
            isDone = false;
        }

        if( isDone ){
            //
            Swal.fire("please go to home page, have fun..");
        }
    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center">
            <div>
                <div>
                    <p>pinata api key : </p>
                    <input type="text" value={ api_kay } onChange={ ApiKeyChange }></input>
                    <p>pinata api secret : </p>
                    <input type="text" value={ api_secret } onChange={ ApiSecretChange }></input>
                </div>
                <div>
                    <button onClick={ pinataConfirm }>確定</button>
                </div>
            </div>
            <div>
                <div>Pinata API Key = { pinataConfigContext.PINATA.API_KEY }</div>
                <div>Pinata API Secret = { pinataConfigContext.PINATA.API_SECRET }</div>
            </div>
        </div>
    )
}

export default PinataConfig;