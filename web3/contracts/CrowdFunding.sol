// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint target;
        uint deadline;
        uint amountCollected;
        string image;
        address[] donators;
        uint[] donations;
    }

    mapping(uint => Campaign) public campaigns;

    uint public numberOfCampaigns;

    function createCampaign(address _owner, string memory _title, string memory _description, 
        uint _target, uint _deadline, string memory _image) public returns(uint) {
            Campaign storage campaign = campaigns[numberOfCampaigns];

            require(campaign.deadline < block.timestamp, "The deadline must be a date in the future.");

            campaign.owner = _owner;
            campaign.title = _title;
            campaign.description = _description;
            campaign.target = _target;
            campaign.deadline = _deadline;
            campaign.image = _image;
            campaign.amountCollected = 0;

            numberOfCampaigns++;

            return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint _id) public payable {
        uint amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{ value: amount }("");

        if(sent) {
            campaign.amountCollected += amount;
        }
    }

    function getDonators(uint _id) public view returns(address[] memory, uint[] memory ) {
        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations);
    }

    function getCampaigns() public view returns(Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i=0; i<numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }

        return allCampaigns;
    }
}