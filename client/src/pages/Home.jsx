import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context';
import { DisplayCampaigns } from '../components';

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getCampaigns } = useStateContext();

  useEffect(() => {
    contract && fetchCampaigns();
  }, [address, contract]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  return (
    <div>
      <DisplayCampaigns
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  )
}

export default Home