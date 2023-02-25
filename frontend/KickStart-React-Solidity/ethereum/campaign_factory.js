//!Web3
import web3 from "./web3";


//!Contract
import Campaign from './build/Campaign.json'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    "0x9B9d758ef470611A2E0184Ac99d0F5b843833860"//The address of the smart contract to call,which this adress already exits blockchain.
)
export default instance;
