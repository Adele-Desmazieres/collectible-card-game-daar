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

  function createCard(string memory data, string memory img) external returns (address) {
    // todo
    return address(new Card(address(0), data, img));
  }

  function createExtension(
    string calldata name,
    int cardCount,
    address[] memory setCards
  ) external {
    sets[count++] = new CardSet(name, cardCount, setCards);
  }
}
