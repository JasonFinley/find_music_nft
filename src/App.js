import { WagmiConfig } from 'wagmi';
import wagmiClient from './helpers/wagmi.client' 
import Router from './Router';
import PinataConfigContextProvider from './contexts/PinataConfigContext';

function App() {

  const pinata_default_api_key = process.env?.REACT_APP_PINATA_API_KEY;
  const pinata_default_api_secret = process.env?.REACT_APP_PINATA_API_SECRET;

  return (
    <WagmiConfig client={ wagmiClient }>
      <PinataConfigContextProvider pinata_api_key={ pinata_default_api_key } pinata_api_secret={ pinata_default_api_secret }>
        <Router />
      </PinataConfigContextProvider>
    </WagmiConfig>
  );
}

export default App;
