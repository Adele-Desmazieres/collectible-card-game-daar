// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Collection.sol";

contract Main is Ownable {
  uint32 private count;
  mapping(uint32 => Collection) private collections;
  mapping(string => uint32) private collectionNameToId;

  event adminCollectionCreation(
    uint32 collectionId,
    string name,
    address author
  );
  event adminCardGift(
    address receiver,
    string collectionName,
    string cardURI,
    address author
  );
  event adminBoosterGift(
    address receiver,
    string collectionName,
    address author
  );

  constructor() Ownable(msg.sender) {
    count = 0;
  }

  fallback() external payable {}

  receive() external payable {}

  // Returns every collections' name.
  function getCollections() external view returns (string[] memory) {
    string[] memory r = new string[](count);

    for (uint32 i = 0; i < count; i++) {
      string memory s = (collections[i]).collectionName();
      r[i] = s;
    }

    return r;
  }

  function getNumberCollections() external view returns (uint32) {
    return uint32(count);
  }

  // Returns the total number of cards of a user.
  function getNumberCardsOf(address user) external view returns (uint32) {
    // console.log("GET NB");
    uint32 nb = 0;
    for (uint32 i = 0; i < count; i++) {
      nb += collections[i].getNumberCardsOf(user);
    }
    return nb;
  }

  // Returns the string with the external ids of cards of a user
  // Concatenated in one string, separated by "\n"
  function getCardsExtIdsOf(address user) public view returns (string memory) {
    string memory extIds = "";
    for (uint32 i = 0; i < count; i++) {
      extIds = string.concat(extIds, collections[i].getCardsExtIdsOf(user));
      extIds = string.concat(extIds, "\n");
    }
    return extIds;
  }

  function isAdmin() public view returns (bool) {
    return (owner() == msg.sender);
  }

  function collectionNameExists(
    string memory name
  ) private view returns (bool) {
    uint32 id = collectionNameToId[name];
    return
      id != 0 ||
      (id == 0 &&
        count > 0 &&
        keccak256(bytes(collections[0].collectionName())) ==
        keccak256(bytes(name)));
  }

  // Creates a collection with specified name.
  // Returns the id of the new collection.
  // Only admins can do this.
  function createCollection(
    string calldata name
  ) external onlyOwner returns (uint32) {
    require(!collectionNameExists(name));
    uint32 id = count;
    collections[id] = new Collection(name);
    collectionNameToId[name] = id;
    count++;
    emit adminCollectionCreation(id, name, msg.sender);
    return id;
  }

  // Create a card in specified collection and gives it to user.
  // Returns the id of the new card.
  // Only admins can do this.
  function giveNewCard(
    address user,
    string memory collectionName,
    string memory cardId
  ) external onlyOwner returns (uint32) {
    require(collectionNameExists(collectionName));
    uint32 cid = collectionNameToId[collectionName];
    emit adminCardGift(user, collectionName, cardId, msg.sender);
    return collections[cid].assignNewCard(user, cardId);
  }

  // Create a booster in specified collection and with specified cards.
  // Returns the id of the new booster.
  // Only admins can do this.
  function giveNewBooster(
    address user,
    string memory collectionName,
    string[] memory cardIds
  ) external onlyOwner returns (uint32) {
    require(collectionNameExists(collectionName));
    uint32 cid = collectionNameToId[collectionName];
    emit adminBoosterGift(user, collectionName, msg.sender);
    return collections[cid].assignNewBooster(user, cardIds);
  }
}
