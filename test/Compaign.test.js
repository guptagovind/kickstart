const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CompaignFactory.json');
const compiledCompaign = require('../ethereum/build/Compaign.json');

let accounts;
let factory;
let compaignAddress;
let compaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0],  gas: '1000000' });

  await factory.methods.createCompaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [compaignAddress] = await factory.methods.getDeployedCompaigns().call();

  compaign = await new web3.eth.Contract(
    JSON.parse(compiledCompaign.interface),
    compaignAddress
  );
});

describe('Compaigns', () => {
  it('deploys a factory and a compaign', () => {
    assert.ok(factory.options.address);
    assert.ok(compaign.options.address)
  });

  it('marks caller as the compaign manager', async () => {
    const manager = await compaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await compaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await compaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('require a minimum contribution', async () => {
    try {
      await compaign.methods.contribute().send({
        from: accounts[1],
        value: '200'
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allow manager to make a payment request', async () => {
    await compaign.methods.createRequest('Buy Batteries', '100000', accounts[1])
      .send({
        from: accounts[0],
        gas: 1000000
      });

    const request = await compaign.methods.requests(0).call();
    assert('Buy Batteries', request.description);
  });

  it('processes requests', async () => {
    await compaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await compaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await compaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await compaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    assert(balance > 104)
  });


});
