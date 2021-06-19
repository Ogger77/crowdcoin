// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
        // tracked who has voted
        mapping(address => bool) approvals;
    }

    // uint256 numRequests;
    // mapping(uint256 => Request) requests;

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    Request[] public requests;

    modifier restricted() {
        require(
            msg.sender == manager,
            "Only the manager can call this function"
        );
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            msg.value > minimumContribution,
            "A minimum contribution is required"
        );
        if (!approvers[msg.sender]) {
            approversCount++;
            approvers[msg.sender] = true;
        }
    }

    function createRequest(
        string memory description,
        uint256 value,
        address payable recipient
    ) public restricted {
        Request storage newRequest = requests.push();

        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        //check if the request come from the approvers list
        require(
            approvers[msg.sender],
            "Only contributors can approve a specific payment request"
        );

        //cheeck if the request has already voted
        require(
            !request.approvals[msg.sender],
            "You have already voted to approve this request"
        );

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        //check the number of yes vote more than half of the backer
        require(
            request.approvalCount > (approversCount / 2),
            "This request needs more approvals before it can be finalized"
        );

        require(!request.complete, "This request has already been finalized");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint256) {
        return requests.length;
    }
}
