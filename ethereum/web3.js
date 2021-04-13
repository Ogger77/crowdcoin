import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  //We are in the browser and metamask is running
  window.ethereum.enable();
  web3 = new Web3(window.web3.currentProvider);
} else {
  //we are on the server or the user don't have metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/76435f6872644b539fbbbfc31dfe4354"
  );
  web3 = new Web3(provider);
}

export default web3;
