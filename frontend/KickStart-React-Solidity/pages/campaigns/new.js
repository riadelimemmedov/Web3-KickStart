import React,{ Component } from "react";

//Thirty Part Packages
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { Router } from '../../routes';


//Custom Components
import Layout from "../../components/Layout";


//Deployed Contract and Abi
import campaign_factory from '../../ethereum/campaign_factory.js'
import web3 from '../../ethereum/web3.js'



class CampaignNew extends Component  {
    state = {
        minimumContribution:'0',
        errorMessage:'',
        loading:false,
        isButtonDisabled:null
    }

    // if javascript !"hello" => false
    
    onSubmit = async (event) => {
        event.preventDefault();
    
        this.setState({loading:true,isButtonDisabled:true,errorMessage:''})
        try{
            const accounts = await web3.eth.getAccounts()
            console.log('List of all accounts in browser ', accounts)

            //!create Campaign object from CampainFactory contract
            const campaign = await campaign_factory.methods.createCampaign(this.state.minimumContribution)
            .send({
                from:accounts[0]
            })

            const blockNumber = await web3.eth.getBlockNumber(console.log)
            console.log('Block Number ', blockNumber)
            console.log('Campaign Number ', campaign)

            Router.pushRoute('/')//Router => using to redirect after some process
        }
        catch(err){
            this.setState({errorMessage:err.message})
        }
        this.setState({loading:false,isButtonDisabled:false})
    }

    render(){
        return(
            <Layout>
                <h3 style={{color:'red'}}>Create Campaign</h3>
                <hr/>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input label='wei' labelPosition="right" placeholder='0' type='number' value={this.minimumContribution} onChange={(event)=>this.setState({minimumContribution:event.target.value})}/>
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button type="submit" disabled={this.state.isButtonDisabled} loading={this.state.loading} primary style={{marginTop:'10px'}}>Create!</Button>

                </Form>
            </Layout>
        )
    }
}
export default CampaignNew;