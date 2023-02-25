//!Web3
import web3 from "./web3";


//!Contract
import Campaign from './build/Campaign.json'
import CampaignFactory from './build/CampaignFactory.json'


export default (address) => { //return anonymous function,when function calling
    return new web3.eth.Contract(
        Campaign.abi,
        address//The address of the smart contract to call,which this adress already exits blockchain.
    )
}