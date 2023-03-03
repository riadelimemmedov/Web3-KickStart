//!Web3
import web3 from "./web3";


//!Contract
import Campaign from './build/Campaign.json'
import CampaignFactory from './build/CampaignFactory.json'

require('dotenv').config()

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    process.env.ADDRESS_CONTRACT//The address of the smart contract to call,which this adress already exits blockchain.
)
export default instance;
