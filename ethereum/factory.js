import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x37b2bFAE88b61435256A62a7358328537aBb1e9d"
);

export default instance;
