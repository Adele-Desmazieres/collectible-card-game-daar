// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./CardSet.sol";

contract Card is Ownable {
  address owner;
  address set;
  // les données en format JSON
  string data;

  constructor(
    address initialOwner,
    address _set,
    string memory _data
  ) Ownable(initialOwner) {
    set = _set;
    data = _data;
  }
}
