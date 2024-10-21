// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Collection.sol";

contract Main {
  uint256 private count;
  mapping(uint256 => Collection) private collections;

  constructor() {
    count = 0;
  }
  
  // Returns the id of the new collection
  function createCollection(string calldata name) external returns (uint256) {
    console.log("===================== CREATE COLLECTION =======================");
    uint256 id = count;
    collections[id] = new Collection(name);
    count++;
    console.log(name);
    return id;
  }
  
  function getNumberCollections() external view returns (uint32) {
    return uint32(count);
  }
  
  fallback() external payable {
    console.log("----- fallback:", msg.value);
  }

  receive() external payable {
    console.log("----- receive:", msg.value);
  }
  
  // Returns the id of the new card
  // TODO : make the cardURI be picked randomly in the card set
  function mintCard(uint256 collectionId, address owner, string memory cardURI) public returns (uint256) {
    console.log("MINT");
    return collections[collectionId].assignNewCard(owner, cardURI);
  }
  
  // Returns the total number of cards of a user
  function getNumberCardsOf(address owner) public view returns (uint256) {
    console.log("GET NB");
    uint256 nb = 0;
    for (uint256 i = 0; i < count; i++) {
      nb += collections[i].getNumberCardsOf(owner);
    }
    return nb;
  }
  
  
}
