const BLKToken = artifacts.require("BLKToken");
const BLKTokenSale = artifacts.require("BLKTokenSale");
const BLKTokenKYC = artifacts.require("BLKTokenKYC");

require('dotenv').config();

const TOTAL_SUPPLY = process.env.TOTAL_SUPPLY;
const RATE = process.env.RATE;

const delay = async (timeout) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('delayed:', timeout);
      resolve("Clear")
    }, timeout)
  })
}

module.exports = async (deployer) => {
  let accounts = await web3.eth.getAccounts();
  
  
  await deployer.deploy(BLKToken, TOTAL_SUPPLY);
  await delay(4000);

  await deployer.deploy(BLKTokenKYC);

  await delay(4000);

  await deployer.deploy(BLKTokenSale, web3.utils.toWei(RATE, "wei"), accounts[0], BLKToken.address, BLKTokenKYC.address);
  
  await delay(4000);

  let instance = await BLKToken.deployed();

  await delay(4000);
  await instance.transfer(BLKTokenSale.address, TOTAL_SUPPLY);
};
