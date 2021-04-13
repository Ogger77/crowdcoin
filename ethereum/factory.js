import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xC534165022db2819F6c6C3D1df9F0002d9106697"
);

export default instance;
