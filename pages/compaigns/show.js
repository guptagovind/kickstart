import React, {Component} from 'react';
import { Card, Grid, Button} from 'semantic-ui-react';
import Compaign from '../../ethereum/compaign';
import web3 from '../../ethereum/web3';

import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CompaignShow extends Component {

  static async getInitialProps(props) {
    const compaign = Compaign(props.query.address);
    const summary = await compaign.methods.getSummary().call();
    console.log(summary);
    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4]
    };
  }

  renderCards() {
    const {
      balance,
      manager,
      minimumContribution,
      requestsCount,
      approversCount
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager create this compaign and can create the request to withdraw money',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become an apporver ',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A Request tries to withdraw money from the contract. Request must be approved by approvers',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who have already donated to this compaign',
        style: {overflowWrap: 'break-word'}
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Compaign Balance (ether)',
        description: 'The balance is how much money this compaign has left to spend',
        style: {overflowWrap: 'break-word'}
      }

    ];

    return <Card.Group items={items}/>;
  }

  render() {
    return (
      <Layout>
        <h1>Compaign Show</h1>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address}/>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/compaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CompaignShow;
