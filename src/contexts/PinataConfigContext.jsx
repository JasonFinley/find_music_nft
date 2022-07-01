import { createContext, useEffect, useState } from "react";

export const PinataConfigContext = createContext( {
    PINATA : {
        API_KEY : "",
        API_SECRET : ""
    },
    PINATA_SET_APIKEY : ( key, secret )=>{},
} );

const PinataConfigContextProvider = ( { children, pinata_api_key, pinata_api_secret } ) => {

    let my_api_key = ( pinata_api_key <= 0 || pinata_api_key === undefined || pinata_api_key === null ) ? "" : pinata_api_key;
    let my_api_secret = ( pinata_api_secret <= 0 || pinata_api_secret === undefined || pinata_api_secret === null ) ? "" : pinata_api_secret;

    const [ PinataApiKey, setPinataApiKey ] = useState({
        PINATA : {
            API_KEY : my_api_key,
            API_SECRET : my_api_secret
        },
        PINATA_SET_APIKEY : ( key, secret )=>{}
    });

    const SetPinataAPIKey = ( api_key, api_secret ) => {
        
        setPinataApiKey( ( preData ) => {
            return ({
                PINATA : {
                    API_KEY : api_key,
                    API_SECRET : api_secret,
                },
                PINATA_SET_APIKEY : SetPinataAPIKey,
            })
        } );
    }

    useEffect( ()=>{

        setPinataApiKey( {
            PINATA : {
                API_KEY : my_api_key,
                API_SECRET : my_api_secret
            },
            PINATA_SET_APIKEY : SetPinataAPIKey,
        });

    } , []);

    return (
        <PinataConfigContext.Provider value={ PinataApiKey }>
            {children}
        </PinataConfigContext.Provider>
    )
}

export default PinataConfigContextProvider;