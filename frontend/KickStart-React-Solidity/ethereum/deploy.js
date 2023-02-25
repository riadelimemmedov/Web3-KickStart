const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const compiledCampaign = require('../ethereum/build/Campaign.json')
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json')

require('dotenv').config()

const provider = new HDWalletProvider(
    process.env.METAMASK_MNEMONIC,
    process.env.INFURA_AOU_KEY_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts()

    console.log('zero indexed account ', accounts[0])

    //!deploy Factory
    const factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
        .deploy({data:compiledCampaignFactory.evm.bytecode.object})
        .send({from:accounts[0],gas:'4712388'})

    console.log('deployed campaign addrerss ', factory.options.address)
    

    //call createCampaing method and create fake a number of campaifn for test front end application
    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas:'4712388'
    });


    [campaignAdress] = await factory.methods.getDeployedCampaigns().call()
    console.log('bunedid ala ', campaignAdress)
    campaign = await new web3.eth.Contract(//create new contract from Campaign contract
        compiledCampaign.abi,
        campaignAdress//The address of the smart contract to call,which this adress already exits blockchain.
    )

    
    provider.engine.stop();
};
deploy();
//0xafE40E4CC7Af34cbCF449a526988140FD3dB76a6