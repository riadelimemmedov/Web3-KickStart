const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());


const compiledCampaign = require('../ethereum/build/Campaign.json')
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json')

let accounts;
let factory;
let campaign;
let campaignAdress;


//*beforeEach
beforeEach(async()=>{
    accounts = await web3.eth.getAccounts()

    //!deploy Factory
    factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
        .deploy({data:compiledCampaignFactory.evm.bytecode.object})
        .send({from:accounts[1],gas:'4712388'})


    //!create Campaign object from CampainFactory contract
    await factory.methods.createCampaign('100').send({
        from:accounts[1],
        gas:'4712388'
    });


    //!connect to already exists node with contact adress
    [campaignAdress] = await factory.methods.getDeployedCampaigns().call()
    campaign = await new web3.eth.Contract(//create new contract from Campaign contract
        compiledCampaign.abi,
        campaignAdress//The address of the smart contract to call,which this adress already exits blockchain.
    )
})

describe('Campaign',()=>{
    it('hello', ()=>{
        assert.ok(factory.options.address)
        assert.ok(campaign.options.address)
    })

    it('marks caller as the campaign manager', async()=>{
        const manager = await campaign.methods.manager().call()
        assert.equal(accounts[1],manager,'Not match manager accounts')
    })

    it('allows people to contribute money and marks them as approvers', async()=>{//*
        await campaign.methods.contribute().send({
            value:'120',
            from:accounts[2]
        })
        const isContributer = await campaign.methods.approvers(accounts[2]).call()
        assert(isContributer)
    })

    it('required a minimum contribution', async()=>{
        try{
            await campaign.methods.contribute().send({
                value:'5',
                from:accounts[2]
            })
            assert(false)
        }
        catch(err){
            console.log('work catch block when checking user is contribute or not')
            assert(err)
        }
    })

    it('allows only a manager to make a payment request', async()=>{
        await campaign.methods
            .createRequest('Buy betteries help me please','150',accounts[3])
            .send({from:accounts[1],gas:'4712388'})

        const requests = await campaign.methods.requests(0).call()
        console.log('approved request list ', requests) 
    })



    //!--------------------------------------------------------------------------------------------------------------------------------
    it('process request from beginning to end',async()=>{
        await campaign.methods.contribute().send({
            from:accounts[4],
            value:web3.utils.toWei('12','ether')//Converts any ether value value into wei.
        })
        console.log('working contribute...')


        await campaign.methods
            .createRequest('Buy car and I am need to money',web3.utils.toWei('5','ether'),accounts[5])
            .send({from:accounts[1],gas:'4712388'})
        console.log('working createRequest...')


        await campaign.methods.approveRequest(0).send({
            from:accounts[4],//if not define contributed account this here,function throw error,because in theory only the manager has the ability to actually finalize the request
            gas:'4712388'
        })
        console.log('working approveRequest...')
        
        console.log(`before approved request user balance - ${await web3.eth.getBalance(accounts[4])}, and user balance type ${typeof await web3.eth.getBalance(accounts[4])} `,)


        await campaign.methods.finalizeRequest(0).send({
            from:accounts[1],
            gas:'4712388'
        })


        console.log('work finalizeRequest...')
        
        console.log('###############################################--------------------------****************************');
        console.log('finish process campaign')

        console.log(`before approved request user balance - ${await web3.eth.getBalance(accounts[4])}, and user balance type ${typeof await web3.eth.getBalance(accounts[4])}`)
        
        let balance = await web3.eth.getBalance(accounts[4])
        balance = web3.utils.fromWei(balance,'ether')//Converts any wei value into an ether value.
        console.log('balancer value after fromWei ', parseFloat(balance))
        balance = parseFloat(balance)

        assert(balance>20)
    })
})


