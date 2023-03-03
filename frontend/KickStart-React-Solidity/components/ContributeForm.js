import React,{ Component } from "react";
import {Form,Input,Message,Button} from 'semantic-ui-react'

//Router
import { Router } from "../routes.js"
import { Link } from '../routes.js';


//Web3 Abi
import Campaign from "../ethereum/campaign.js";
import web3 from "../ethereum/web3.js";


//!ContributeForm
class ContributeForm extends Component{
    state = {
        contributeValue:'',
        errorMessage:'',
        loading:false,
        isButtonDisabled:null
    }

    getMetamaskAccount = async() => {
        const account = await web3.eth.getAccounts()
        const balance = await web3.eth.getBalance(account[0])
    }

    onSubmit = async (event) => {
        event.preventDefault()//for event cancels the event if it is cancelable,

        const campaign = Campaign(this.props.selectedAdress)

        this.setState({loading:true,isButtonDisabled:true,errorMessage:''})
        try{
            const accounts = await web3.eth.getAccounts()
            const metamaskAccount = await web3.eth.getAccounts()
            const balance = await web3.eth.getBalance(metamaskAccount[0])

            if(web3.utils.toWei(balance,'ether') > web3.utils.toWei(this.state.contributeValue,'ether')){
                await campaign.methods.contribute().send({
                    from:accounts[0],
                    value:web3.utils.toWei(this.state.contributeValue,'ether')
                })
                //Router.replaceRoute(window.location.href)
                //*or
                Router.replaceRoute(`/campaigns/${this.props.selectedAdress}`)
                document.getElementById('contribe_value').value = ''

            }
            else{
                alert('Not enough balance of metamask account for this transaction')
                setTimeout(()=>{
                    window.location.reload()
                },0.1)
            }
            

        }
        catch(err){
            this.setState({errorMessage:err.message})
        }
        this.setState({loading:false,isButtonDisabled:false})

    } 

    render(){
        return(
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <h1>Current address kickstar at blockchain - {this.props.selectedAdress}</h1>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input id="contribe_value" onChange={event=>this.setState({contributeValue:event.target.value})} label="ether" labelPosition="right" required={true} placeholder="Input contribution value"/>
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage}/>
                <Button type="submit" disabled={this.state.isButtonDisabled} loading={this.state.loading} primary>
                    Contribute!
                </Button>
                <button type="button" onClick={this.getMetamaskAccount}>getaccount</button>
            </Form>
        )
    }
}
export default ContributeForm;