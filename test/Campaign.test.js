const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = Web3.givenProvider || ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: "0x" + compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1600000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1600000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("mark caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it("allow people to contribute money and mark them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("require minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allow manager to make pay request", async () => {
    await campaign.methods
      .createRequest("Buy battery", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1600000",
      });

    const request = await campaign.methods.requests(0).call();

    assert("Buy battery", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest(
        "example request",
        web3.utils.toWei("5", "ether"),
        accounts[1]
      )
      .send({ from: accounts[0], gas: "1600000" });

    //approve the request
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1600000",
    });

    //finalize the request
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1600000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
