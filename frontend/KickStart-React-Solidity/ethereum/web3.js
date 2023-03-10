import Web3 from "web3";

require('dotenv').config()


let web3;
if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
    //We are in the browser and metamask is running
    window.ethereum.request({method:'eth_requestAccounts'})//connect to metamask account which has to located in browser
    web3 = new Web3(window.ethereum)
}
else{
    //We are on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider(//interact cloud node
        process.env.GEORLI_NODE_URL
    )
    web3 = new Web3(provider)
}
export default web3


//if using only create react app javascript code run browser only
//if using next js javascript code run node js server

