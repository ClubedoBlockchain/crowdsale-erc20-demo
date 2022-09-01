// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BLKTokenKYC is Ownable {
    mapping( address => bool) public allowed;
    address[] public list;  
    
    function completed(address _to) public onlyOwner {
        require(allowed[_to] == false, "User is already in the list");
        allowed[_to] = true;
        list.push(_to);
    }

    function revoked(address _to) public onlyOwner {
        allowed[_to] = false;
        for(uint i = 0; i < list.length; i++) {
            if (list[i] == _to) {
                list[i] = list[list.length - 1];
                list.pop();
                break;
            }
        }
    }

    function getListOfAddress() public view returns( address  [] memory){
        return list;
    }

}
