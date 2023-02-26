import React,{ Component } from 'react'

//Semantic Ui and Next js router
import { Card,Button,Table,Segment } from 'semantic-ui-react'
import { Link } from '../routes.js';


//Web3 Abi
import Campaign from '../ethereum/build/Campaign.json'
import web3 from "../ethereum/web3.js";

class RequestRow extends Component {

    onApprove = async() => {
        const campaign = await new web3.eth.Contract(Campaign.abi,this.props.address)
        const accounts = await new web3.eth.getAccounts()

        await campaign.methods.approveRequest(this.props.id).send({
            from:accounts[0],
        })
    }

    onFinalize = async() => {
        const campaign = await new web3.eth.Contract(Campaign.abi,this.props.address)
        const accounts = await new web3.eth.getAccounts()

        await campaign.methods.finalizeRequest(this.props.id).send({
            from:accounts[0]
        })
    }

    render(){
        const { Row,Cell} = Table
        const { id,request,address,approversCount } = this.props
        const readyToFinalize = request.approvalCount > approversCount / 2

        return(
            <Row disabled={request.complete} positive={!request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>
                    {request.approvalCount}/{approversCount}
                </Cell>
                <Cell>
                    {request.complete ? <h3 style={{'color':'#3E54AC'}}>Already Approved</h3> : (
                        <Button onClick={this.onApprove} color="green" basic>Approve</Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? <h3 style={{'color':'#3E54AC'}}>Already Finalized</h3> : (
                        <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>
                    )}
                </Cell>
            </Row>
        )
    }
}
export default RequestRow