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

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns();
    
        const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);
    
        return filteredCampaigns;
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', [pId], { value: ethers.utils.parseEther(amount)});

        return data;
    }

    const getDonators = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);
        
        const numberOfDonations = donations[0].length;
        const parsedDonations = [];
        
        for(let i=0; i<numberOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }
        return parsedDonations;
    }

    return (
        <StateContext.Provider 
            value={{
                address,
                contract,
                connect,
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                donate,
                getDonators
            }}
        >
            { children }
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);