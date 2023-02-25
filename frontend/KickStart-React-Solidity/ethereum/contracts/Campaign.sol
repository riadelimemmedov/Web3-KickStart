// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.17;

contract CampaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public{
        address newCampaign = address(new Campaign(minimum,msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;
    }
}

//Campaign

contract Campaign{
    mapping(address => bool) approvals;//track who has voted => Mapping can only have type of storage and are generally used for state variable

    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
    }

    Request[] public requests;

    address public manager;
    uint public minimumContribution;
    
    //address[] public approvals;//when creating approveRequest function used this variable
    mapping(address => bool) public approvers;
    uint public approversCount;//when calling contribute function every time,approvalCount variable increase number +1

    constructor(uint minimum,address creator){
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {//contribute = voted
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
        //approvals.push(msg.sender);//join game,who voted if used array

    }

    //createRequest
    function createRequest(string memory description,uint value,address recipient) public restricted{
        //require(approvals[msg.sender]);
        Request memory newRequest = Request({
            description:description,
            value:value,
            recipient:recipient,
            complete:false,
            approvalCount:0
        });

        //!Alternative,but not recommended
        //Request(description,value,recipient,false)
        
        requests.push(newRequest);
        //after createRequest method => approveRequest method
    }


    function approveRequest(uint indexvalue) public {
        Request storage request = requests[indexvalue];

        require(approvers[msg.sender]);//check is user voted
        require(!approvals[msg.sender]);//false*false=true

        approvals[msg.sender] = true;
        request.approvalCount++;    
    }

    function finalizeRequest(uint indexvalue) public restricted{
        //Finalize request,if approveRequest greater than 50% 
        Request storage request = requests[indexvalue];

        require(request.approvalCount > (approversCount/2));
        require(!request.complete);
        
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint,uint,uint,uint,address){
        return(
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }


    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
}
