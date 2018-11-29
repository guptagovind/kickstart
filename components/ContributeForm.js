import React , { Component } from 'react';
import { Form, Message, Input, Button } from 'semantic-ui-react';
import { Router } from '../routes';

import Compaign from '../ethereum/compaign';
import web3 from '../ethereum/web3';


class ContributeForm extends Component{

  state = {
    value: '',
    loading: false,
    errorMessage: ''
  };

  onSubmit = async event => {
    event.preventDefault();

    const compaign = Compaign(this.props.address);
    this.setState({
      loading: true,
      errorMessage: ''
    });

    try {
      const accounts = await web3.eth.getAccounts();
      await compaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });
      Router.replaceRoute(`/compaigns/${this.props.address}`);

    } catch (error) {
      this.setState({
        errorMessage: error.message
      });
    }
    this.setState({
      loading: false,
      value: ''
    })
  };

  render = () => {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            value={this.state.value}
            label="ether"
            labelPosition="right"
            onChange={event => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        <Message error header='Oops!' content={this.state.errorMessage}/>
        <Button loading={this.state.loading} primary>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
