const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
//delete the default build path
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const output = solc.compile(source, 1).contracts;

//check if the directory exist, if not create it
fs.ensureDirSync(buildPath);

for (let contract in output) {
  let name = contract.replace(":", "");
  fs.outputJSONSync(path.resolve(buildPath, name + ".json"), output[contract]);
}
