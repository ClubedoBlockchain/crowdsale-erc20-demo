const Token = artifacts.require("BLKToken");
const TokenSale = artifacts.require("BLKTokenSale");
const TokenKYC = artifacts.require("BLKTokenKYC");

require("dotenv").config();

const RATE = process.env.RATE;

const chai = require("./setupchai");
const BN = web3.utils.BN;

const expect = chai.expect;
contract("TokenSale Test", async accounts => {
    const [initialHolder, recipient, anotherAccount] = accounts;
    
    it("Shouldnt have any token in my account", async () => {
        let instance = await Token.deployed();
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("Check TokenSale balance", async () => {
        let instance = await Token.deployed();
        let balanceOfTokenSale = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        expect(balanceOfTokenSale).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be possible to buy tokens ", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let tokenKYCInstance = await TokenKYC.deployed();
        
        await expect(tokenKYCInstance.completed(initialHolder, { from: initialHolder })).to.be.fulfilled;    
       
        
        let balanceBefore = await tokenInstance.balanceOf(initialHolder);


        let priceInWeiPerToken = await tokenSaleInstance.weiPerToken(RATE);
            
        await expect(tokenSaleInstance.sendTransaction({ from: initialHolder, value: web3.utils.toWei(priceInWeiPerToken, "wei") })).to.be.fulfilled;

        
        let balanceAfter = await tokenInstance.balanceOf(initialHolder);


        return expect(balanceAfter).to.be.a.bignumber.equal(balanceBefore.add(new BN(1)));

    });
});
