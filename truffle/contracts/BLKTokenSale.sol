// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./Crowdsale.sol";
import "./BLKTokenKYC.sol";

contract BLKTokenSale is Crowdsale {
    using SafeMath for uint256;

    BLKTokenKYC kyc;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token,
        BLKTokenKYC _kyc
    ) Crowdsale(rate, wallet, token) {
        kyc = _kyc;
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount)
        internal
        view
        override
    {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(kyc.allowed(msg.sender), "KYC is not completed");
    }
}
