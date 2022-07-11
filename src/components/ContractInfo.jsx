import ContextContractAddressABI from "../contexts/ContextContract"
import { useAccount, useContractRead, useContractWrite, useContractEvent } from "wagmi"
import { useContext } from "react";

const ContractInfo = () => {

    const { data: account } = useAccount();
    const contractContext = useContext( ContextContractAddressABI );

    const getContractOwner = useContractRead( 
        contractContext,
        "getContractOwner",
        {
            watch : true,
        }
    );

    const getTotalTokenIDs = useContractRead(
        contractContext,
        "getTotalTokenIDs",
        {
            watch : true,
        }
    );

    const getWhiteListData = useContractRead(
        contractContext,
        "getWhiteListData",
        {
            watch : true,
        }
    );

    const btnDebugLog = () => {
        console.log( getContractOwner );
        console.log( getTotalTokenIDs );
    }

    return (
        <div>
            <h3>目前智能合約資訊</h3>
            { account? 
                (
                    <div>
                        <div>合約擁有者 : { getContractOwner?.data?.toString() }</div>
                        <div>音樂創作者 : </div>
                        {
                            getWhiteListData?.data?.map( (item) => {
                                return ( <div key={item?.creator}> { item?.creator.toString() }</div> )
                            })
                        }
                        <div>共幾首歌 : { getTotalTokenIDs?.data?.toNumber() }</div>
                    </div>
                ):(
                    <div>
                        <div>合約擁有者 : please connect MetaMask</div>
                    </div>
                )

            }
            {
            //<button onClick={ btnDebugLog }> LOG </button>
            }

        </div>
    )
}

export default ContractInfo;