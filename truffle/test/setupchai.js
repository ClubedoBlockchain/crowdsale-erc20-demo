
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");


const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);

chai.use(chaiBN);
chai.use(chaiAsPromised);

module.exports = chai;