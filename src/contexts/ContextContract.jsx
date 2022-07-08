import { contractAddress, contractABI, contractRinkebyAddress } from "../configs/contract"
import { createContext } from "react";

const ContextContractAddressABI = createContext( {
    addressOrName: contractRinkebyAddress,
    contractInterface: contractABI
});

export default ContextContractAddressABI;