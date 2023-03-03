import React,{ Component } from "react";

//Semantic Ui and Next js router
import { Card,Button,Form,Message,Input } from 'semantic-ui-react'
import { Link,Router } from '../../../routes.js';

//Custom Components
import Layout from '../../../components/Layout.js'


//Deployed Contract and Abi
import Campaign from '../../../ethereum/build/Campaign.json'
import web3 from '../../../ethereum/web3.js'


//!RequestNew
class RequestNew extends Component{
    state = {
        //?For creating new instance campaign requests
        value:'',
        description:'',
        recipient_address: '',

        //?For handling error or loading
        errorMessage:'',
        loading:false,
        isButtonDisabled:null
    }

    static async getInitialProps(props){
        const { address } = props.query
        return { address }
    }

    onSubmit = async(event) => {
        event.preventDefault()

        this.setState({loading:true,isButtonDisabled:true,errorMessage:''})
        //const campaign = Campaign(this.props.address)//get to campaign instance using campaign adress
        const campaign = await new web3.eth.Contract(
            Campaign.abi,
            this.props.address
        )
        
        const {description,value,recipient_address} = this.state

        try{
            const accounts = await web3.eth.getAccounts()
            await campaign.methods
                        .createRequest(description,web3.utils.toWei(value,'ether'),recipient_address)
                        .send({from:accounts[0]})
        }
        catch(err){
            this.setState({errorMessage:err.message})
        }
        this.setState({loading:false,isButtonDisabled:false})

    }


    render(){
        return(
            <Layout>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input value={this.state.description} onChange={(event)=>this.setState({description:event.target.value})} required/>
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input value={this.state.value} onChange={(event)=>this.setState({value:event.target.value})} required/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient Adress</label>
                        <Input value={this.state.recipient_address} onChange={(event)=>this.setState({recipient_address:event.target.value})} required/>
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button type="submit" disabled={this.state.isButtonDisabled} loading={this.state.loading} style={{marginTop:'10px'}} primary>Create!</Button>
                </Form>
            </Layout>
        )
    }
}
export default RequestNew