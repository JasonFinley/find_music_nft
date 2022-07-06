import { createContext, useEffect, useState } from "react";

export const ContextPinataConfig = createContext( {
    PINATA : {
        API_KEY : "",
        API_SECRET : ""
    },
    PINATA_SET_APIKEY : ( key, secret )=>{},
} );

const ContextProviderPinataConfig = ( { children, pinata_api_key, pinata_api_secret } ) => {

    const myApiKey = ( pinata_api_key <= 0 || pinata_api_key === undefined || pinata_api_key === null ) ? "" : pinata_api_key;
    const myApiSecret = ( pinata_api_secret <= 0 || pinata_api_secret === undefined || pinata_api_secret === null ) ? "" : pinata_api_secret;

    const [ pinataApiKey, setPinataApiKey ] = useState({
        PINATA : {
            API_KEY : myApiKey,
            API_SECRET : myApiSecret
        },
        PINATA_SET_APIKEY : ( key, secret )=>{}
    });

    const setMyPinataAPIKey = ( api_key, api_secret ) => {
        
        setPinataApiKey( ( preData ) => {
            return ({
                PINATA : {
                    API_KEY : api_key,
                    API_SECRET : api_secret,
                },
                PINATA_SET_APIKEY : setMyPinataAPIKey,
            })
        } );
    }

    useEffect( ()=>{

        setPinataApiKey( {
            PINATA : {
                API_KEY : myApiKey,
                API_SECRET : myApiSecret
            },
            PINATA_SET_APIKEY : setMyPinataAPIKey,
        });
// eslint-disable-next-line 
    }, []);

    return (
        <ContextPinataConfig.Provider value={ pinataApiKey }>
            {children}
        </ContextPinataConfig.Provider>
    )
}

export default ContextProviderPinataConfig;