import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xE15cdAD3BBE4415D7ee3E42B72b8884170F6276F');

    const { mutateAsync : createCampaign } = useContractWrite(contract, 'createCampaign');
    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampaign({
                args: [
                    address, // Owner
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image
                ]
            })

            console.log("contract call success!", data);
        } catch (error) {
            console.log("contract call failure!", error);
        }
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns');

        const parsedCampaigns = campaigns.map((camp, i) => {
            return {
                owner: camp.owner,
                title: camp.title,
                description: camp.description,
                target: ethers.utils.formatEther(camp.target.toString()),
                deadline: camp.deadline.toNumber(),
                amountCollected: ethers.utils.formatEther(camp.amountCollected.toString()),
                image: camp.image,
                pId: i
            }
        })
        
        return parsedCampaigns;
    }

    return (
        <StateContext.Provider 
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns
            }}
        >
            { children }
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);