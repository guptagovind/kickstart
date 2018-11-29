import React, {Component} from 'react';
import {Card, Button} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout'
import { Link } from '../routes';


class CompaignIndex extends Component {
  static async getInitialProps() {
    const compaigns = await factory.methods.getDeployedCompaigns().call();
    return {compaigns};
  }

  renderCompaigns() {
    const items = this.props.compaigns.map(address => {
      return {
        header: address,
        description:
          (
            <Link route={`/compaigns/${address}`}>
              <a>View Compaign</a>
            </Link>
          ),
        fluid: true
      }
    });
    return <Card.Group items={items}/>;
  }


  render = () => {
    return (
      <Layout>
        <div>
          <h3>Open Compaign</h3>
          <Link route="/compaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Compaign"
                icon="add"
                primary
              />
            </a>
          </Link>
          {this.renderCompaigns()}
        </div>
      </Layout>
    )
  }
}

export default CompaignIndex;
