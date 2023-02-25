import React,{ Component,Fragment } from "react";
import campaign_factory from '../ethereum/campaign_factory.js'

//Semantic Ui and Next js router
import { Card,Button } from 'semantic-ui-react'
import { Link } from '../routes.js';



//Custom Components
import Layout from '../components/Layout.js'


class Campaign extends Component{
    static async getInitialProps(){
        const campaigns = await campaign_factory.methods.getDeployedCampaigns().call()
        console.log('all deployed campaign ', campaigns)
        return {campaigns}
    }

    //!renderCampaigns
    renderCampaigns(){
        const items = this.props.campaigns.map((adress) => {
            return{
                header:adress,
                description:(
                    <Link route={`/campaigns/${adress}`}>
                        <a>View Campaign Details</a>
                    </Link>
                ),
                fluid:true
            }
        })
        return <Card.Group items={items}/>
    }

    //*render
    render(){
            return(
                <Layout>
                    <div>
                        <h3>Open Campaigns</h3>
                        <Link route="/campaigns/new">
                            <a>
                                <Button floated="right" content="Create Campaign" icon="add circle" primary/>
                            </a>
                        </Link>
                        {this.renderCampaigns()}
                    </div>
                </Layout>
            )
    }
}
export default Campaign


// export default () => {
//     return <h1>This is base root page</h1>
//} == window.onload = function () {}
