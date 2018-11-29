import React, {Component} from 'react';
import { Button, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import Compaign from '../../../ethereum/compaign'
import RequestRow from '../../../components/RequestRow';


class RequestIndex extends Component {

  static async getInitialProps(props) {
    const { address } = props.query;
    const compaign = Compaign(address);
    const requestCount = await compaign.methods.getRequestsCount().call();
    const approversCount = await compaign.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return compaign.methods.requests(index).call();
        })
    );
    return { address, requests, requestCount, approversCount };
  }

  renderRows = () => {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      )
    })
  };

  render = () => {
    const { Header, Row, HeaderCell, Body} = Table;

    return (
      <Layout>
        <Link route={`/compaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{marginBottom: 10}}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }

}

export default RequestIndex;
