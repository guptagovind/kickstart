import web3 from './web3';
import Compaign from './build/Compaign.json';

export default (address) => {
  return new web3.eth.Contract(
    JSON.parse(Compaign.interface),
    address
  );
};
