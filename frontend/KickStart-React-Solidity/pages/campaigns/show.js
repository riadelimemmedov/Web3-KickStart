import React,{ Component } from "react";
import { Card, Grid, Button } from 'semantic-ui-react';

//Router
import { Router } from "../../routes.js"
import { Link } from '../../routes.js';


//My components
import Layout from "../../components/Layout";
import ContributeForm from "../../components/ContributeForm";

//Web3 Abi
import Campaign from '../../ethereum/campaign.js'
import web3 from "../../ethereum/web3";


//!CampaignShow
class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address)//find exists campaign in blockchain

        const summary = await campaign.methods.getSummary().call()


        return {
            selectedAdress:props.query.address,
            minimumContribution:summary[0],
            balance:summary[1],
            requestsCount:summary[2],
            approversCount:summary[3],
            manager:summary[4]
        }
    }

    renderCards(){
        const{balance,manager,minimumContribution,requestsCount,approversCount} = this.props
    
        const items = [
            {
                header:manager,
                meta:'Address of Manager',
                description:'The manager created this campaign and can create requests to witdraw money',
                style:{overflowWrap:'break-word'}
            },
            {
                header:minimumContribution,
                meta:'Minimum Contribution (wei)',
                description:'You must contribute at least this much wei to become an approver'
            },
            {
                header:requestsCount,
                meta:'Number of Requests',
                description:'A request tries to withdraw money from the contract.Requestss must be approved by approvers'
            },
            {
                header:approversCount,
                meta:'Number of Approvers',
                description:'Number of people who have already donated to this campaign'
            },
            {
                header:web3.utils.fromWei(balance,'ether'),
                meta:'Campaign Balance (ether)',
                description:'The balance is how much money this campaign has left to spend'
            }
        ]
        return <Card.Group items={items}/>
    }

    render(){
        return(
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={9}>
                            {this.renderCards()}
                            </Grid.Column>
                        <Grid.Column width={7}>  
                            <ContributeForm selectedAdress={this.props.selectedAdress}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.selectedAdress}/requests`}>
                                <a>
                                    <Button color='green'>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    }
}
export default CampaignShow;