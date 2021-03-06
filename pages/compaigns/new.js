import React, {Component} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';

import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

import Layout from '../../components/Layout';
import { Router } from '../../routes';


class CompaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errorMessage: ''
    });
    try{
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCompaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    }catch(error){
      this.setState({
        errorMessage: error.message
      });
    }
    this.setState({
      loading: false
    });
  };

  render = () => (
    <Layout>
      <h3>Create a compaign</h3>
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Minimum Contribution </label>
          <Input
            label="wei"
            labelPosition="right"
            value={this.state.minimumContribution}
            onChange= {
              event => this.setState({minimumContribution: event.target.value})
            }
          />
        </Form.Field>
        <Message error header="Opps!" content={this.state.errorMessage}/>
        <Button loading={this.state.loading} primary>Create!</Button>
      </Form>
    </Layout>
  )
}

export default CompaignNew;
