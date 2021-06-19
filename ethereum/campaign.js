import web3 from "./web3";
import Campaign from "./build/Campaign.json";

const campaign = (campaign) => {
  return new web3.eth.Contract(Campaign.abi, campaign);
};

export default campaign;
