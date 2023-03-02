//!Web3
import web3 from "./web3";


//!Contract
import Campaign from './build/Campaign.json'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0xc0a493017E79Ea9941E407847D630986C156465F"//The address of the smart contract to call,which this adress already exits blockchain.
)
export default instance;
