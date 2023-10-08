import React, { useEffect, useState } from 'react'
import { useStateContext } from '../context';

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
    console.log({ data })
  }

  return (
    <div>Home</div>
  )
}

export default Home