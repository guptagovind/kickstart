import web3 from './web3';
import CompaignFactory from './build/CompaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CompaignFactory.interface),
  '0x63D9bfe0d948B1373821e9E00c94E0CA946cA819'
);

export default instance;
