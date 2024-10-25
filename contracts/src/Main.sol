// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Collection.sol";

contract Main is Ownable {
  uint32 private count;
  mapping(uint32 => Collection) private collections;
  
  event adminCollectionCreation(uint32 collectionId, string name, address author);
  event adminCardGift(address receiver, string collectionName, string cardURI, address author);
  
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
  
  function getCollections() external view returns (string[] memory) {
    console.log("GET COLLECTIONS");
    string[] memory r = new string[](count);

    console.log("count", count);
    for (uint32 i = 0; i < count; i++) {
      console.log(i);
      string memory s = (collections[i]).collectionName();
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
  ) private view returns (uint32) {
    for (uint32 i = 0; i < count; i++) {
      string memory s = (collections[i]).collectionName();
      if (keccak256(bytes(s)) == keccak256(bytes(name))) {
        return i;
      }
    }
    revert("Collection not found with specified name.");
  }
  
  // Returns the total number of cards of a user
  function getNumberCardsOf(address user) external view returns (uint32) {
    console.log("GET NB");
    uint32 nb = 0;
    for (uint32 i = 0; i < count; i++) {
      nb += collections[i].getNumberCardsOf(user);
    }
    return nb;
  }

  // Returns the string with the URLs of cards of a user
  // Concatenated in one string, separated by "\n"
  function getCardsUrlsOf(address user) public view returns (string memory) {
    console.log("GET URLS");
    string memory cards = "";
    for (uint32 i = 0; i < count; i++) {
      cards = string.concat(cards, collections[i].getCardsUrlsOf(user));
      cards = string.concat(cards, "\n");
    }
    return cards;
  }

  function isAdmin() public view returns (bool) {
    return (owner() == msg.sender);
  }
  
  // Creates a collection with specified name.
  // Returns the id of the new collection.
  // Only admins can do this. 
  function createCollection(string calldata name) external onlyOwner returns (uint32) {
    console.log("CREATE COLLECTION");
    uint32 id = count;
    collections[id] = new Collection(name);
    count++;
    console.log("COLLECTION", id, " : ", name);
    
    emit adminCollectionCreation(id, name, msg.sender);
    return id;
  }
  
  // Create a card in specified collection and gives it to user.
  // Returns the id of the new card.
  // Only admins can do this. 
  function giveNewCard(
    address user,
    string memory collectionName,
    string memory cardURI
  ) external onlyOwner returns (uint32) {
    console.log("MINT");
    uint32 cid = collectionNameToId(collectionName);
    
    emit adminCardGift(user, collectionName, cardURI, msg.sender);
    return collections[cid].assignNewCard(user, cardURI);
  }
  
  // TODO : admin give new booster ? Not needed.
  
}
