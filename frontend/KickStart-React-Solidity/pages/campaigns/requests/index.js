import React,{ Component } from "react";

//My components
import Layout from '../../../components/Layout.js'
import RequestRow from '../../../components/RequestRow.js'


//Semantic Ui and Next js router
import { Card,Button,Table } from 'semantic-ui-react'
import { Link } from '../../../routes.js';


//Deployed Contract and Abi
import Campaign from '../../../ethereum/build/Campaign.json'
import web3 from '../../../ethereum/web3.js'


//!RequestIndex
class RequestIndex extends Component{
    static async getInitialProps(props){
        const {address} = props.query //using object destructuring,extract data from object and maps to news,distinct variables
        const campaign = await new web3.eth.Contract(Campaign.abi,address)
        const requestCount = await campaign.methods.getRequestsCount().call()
        const approversCount = await campaign.methods.approversCount().call()

        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((element,index) => {
                    return campaign.methods.requests(index).call()
                })
        )
        
        return {address,requests,requestCount,approversCount}  
    }

    renderRows(){
        return this.props.requests.map((request,index)=>{
            return(
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
                />
            )
        })
    }

    render(){
        const { Header,Row,HeaderCell,Body } = Table

        return(
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button color='yellow' floated="right" style={{marginBottom:'15px'}}><b>Add Request</b></Button>
                    </a>
                </Link>
                <Table style={{marginTop:'30px'}}>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Is Approve</HeaderCell>
                            <HeaderCell>Is Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>
                    Found <b style={{color:'green'}}>{this.props.requestCount}</b> requests
                </div>
            </Layout>
        )
    }
}
export default RequestIndex