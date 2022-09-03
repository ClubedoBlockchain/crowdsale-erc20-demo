const BLKToken = artifacts.require("BLKToken");
const BLKTokenSale = artifacts.require("BLKTokenSale");
const BLKTokenKYC = artifacts.require("BLKTokenKYC");

require("dotenv").config({ path: "../.env" });

const TOTAL_SUPPLY = process.env.TOTAL_SUPPLY;
const RATE = process.env.RATE || 1;

module.exports = async (deployer) => {
  let accounts = await web3.eth.getAccounts();
  
  await deployer.deploy(BLKToken, TOTAL_SUPPLY);
  await deployer.deploy(BLKTokenKYC);
  await deployer.deploy(BLKTokenSale, web3.utils.toWei(RATE, "wei"), accounts[0], BLKToken.address, BLKTokenKYC.address);
  
  let instance = await BLKToken.deployed();
  await instance.transfer(BLKTokenSale.address, TOTAL_SUPPLY);
};
