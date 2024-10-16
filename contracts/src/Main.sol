// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./CardSet.sol";

contract Main is Ownable {
  int private count;
  mapping(int => CardSet) private sets;
  mapping(address => Card) private cards;

  constructor() Ownable(msg.sender) {
    count = 0;
  }

  function createCard(string memory data, string memory img) external returns (Card) {
    // todo
    return new Card(address(msg.sender), data, img);
  }
  
  function dummy() external pure returns (int) {
    return 777;
  }

  function createExtension(
    string calldata name,
    int cardCount,
    address[] memory setCards
  ) external {
    sets[count++] = new CardSet(name, cardCount, setCards);
  }
}
