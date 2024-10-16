// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./Card.sol";

contract CardSet {
  string public name;
  int public cardCount;
  address[] public cards;

  constructor(string memory _name, int _cardCount, address[] memory _cards) {
    name = _name;
    cardCount = _cardCount;
    cards = _cards;
  }
}
