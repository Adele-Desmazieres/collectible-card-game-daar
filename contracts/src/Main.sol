// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Collection.sol";

contract Main is Ownable {
  uint256 private count;
  mapping(uint256 => Collection) private collections;

  constructor() Ownable(msg.sender) {
    count = 0;
    console.log("ADMIN : ", owner(), "msg.sender : ", msg.sender);
  }

  fallback() external payable {
    console.log("fallback:", msg.value);
  }

  receive() external payable {
    console.log("receive:", msg.value);
  }

  // Creates a collection with specified name.
  // Returns the id of the new collection.
  function createCollection(
    string calldata name
  ) external onlyOwner returns (uint256) {
    console.log("CREATE COLLECTION");
    uint256 id = count;
    collections[id] = new Collection(name);
    count++;
    console.log("COLLECTION", id, name);
    return id;
  }

  function getCollections() external view returns (string[] memory) {
    console.log("GET COLLECTIONS");
    string[] memory r = new string[](count);

    console.log("count", count);
    for (uint256 i = 0; i < count; i++) {
      console.log(i);
      string memory s = (collections[i]).getCollectionName();
      console.log(s);
      r[i] = s;
    }

    return r;
  }

  function getNumberCollections() external view returns (uint32) {
    return uint32(count);
  }

  function collectionNameToId(
    string memory name
  ) private view returns (uint256) {
    for (uint i = 0; i < count; i++) {
      string memory s = (collections[i]).getCollectionName();
      if (keccak256(bytes(s)) == keccak256(bytes(name))) {
        return i;
      }
    }
    revert("Collection not found with specified name.");
  }

  // Create a card in specified collection and gives it to user
  // Returns the id of the new card
  function mintCard(
    address user,
    string memory collectionName,
    string memory cardURI
  ) external onlyOwner returns (uint256) {
    console.log("MINT");
    uint cid = collectionNameToId(collectionName);
    return collections[cid].assignNewCard(user, cardURI);
  }

  // Returns the total number of cards of a user
  function getNumberCardsOf(address user) public view returns (uint256) {
    console.log("GET NB");
    uint256 nb = 0;
    for (uint256 i = 0; i < count; i++) {
      nb += collections[i].getNumberCardsOf(user);
    }
    return nb;
  }

  // Returns the string of URL of cards of a user
  // in one string, sparated by "\n"
  function getCardsUrlsOf(address user) public view returns (string memory) {
    console.log("GET URLS");
    string memory cards = "";
    for (uint256 i = 0; i < count; i++) {
      cards = string.concat(cards, collections[i].getCardsUrlsOf(user));
      cards = string.concat(cards, "\n");
    }
    return cards;
  }

  function isAdmin() public view returns (bool) {
    return (owner() == msg.sender);
  }
}
