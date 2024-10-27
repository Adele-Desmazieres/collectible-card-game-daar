// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Collection.sol";
import "./BoosterManager.sol";

contract Main is Ownable {
  uint32 private count;
  BoosterManager private bm;
  mapping(uint32 => Collection) private collections;
  mapping(string => uint32) private coNameToCoId;

  event adminCollectionCreation(
    uint32 coId,
    string name,
    address author
  );
  event adminCardGift(
    address receiver,
    string coName,
    string extId,
    address author
  );
  event adminBoosterGift(
    address receiver,
    string coName,
    address author
  );
  event BoosterOpened(
    address indexed user,
    string collectionName,
    string[] cardIds
  );

  constructor() Ownable(msg.sender) {
    count = 0;
    bm = new BoosterManager();
  }

  fallback() external payable {}

  receive() external payable {}

  // Returns every collections' name.
  function getCollections() external view returns (string[] memory) {
    string[] memory r = new string[](count);

    for (uint32 i = 0; i < count; i++) {
      string memory s = (collections[i]).getCoName();
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
    uint32 coId = coNameToCoId[name];
    return
      coId != 0 ||
      (coId == 0 &&
        count > 0 &&
        keccak256(bytes(collections[0].coName())) ==
        keccak256(bytes(name)));
  }

  // Creates a collection with specified name.
  // Returns the id of the new collection.
  // Only admins can do this.
  function createCollection(
    string calldata name
  ) external onlyOwner returns (uint32) {
    require(!collectionNameExists(name));
    uint32 coId = count;
    collections[coId] = new Collection(name);
    coNameToCoId[name] = coId;
    count++;
    emit adminCollectionCreation(coId, name, msg.sender);
    return coId;
  }

  // Create a card in specified collection and gives it to user.
  // Returns the id of the new card.
  // Only admins can do this.
  function giveNewCard(
    address user,
    string memory coName,
    string memory cardId
  ) external onlyOwner returns (uint32) {
    require(collectionNameExists(coName));
    uint32 coId = coNameToCoId[coName];
    emit adminCardGift(user, coName, cardId, msg.sender);
    return collections[coId].assignNewCard(user, cardId);
  }

  // Create a booster in specified collection and with specified cards.
  // Returns the id of the new booster.
  // Only admins can do this.
  function giveNewBooster(
    address user,
    string memory coName,
    string[] memory cardIds
  ) external onlyOwner returns (uint32) {
    require(collectionNameExists(coName));
    uint32 coId = coNameToCoId[coName];
    emit adminBoosterGift(user, coName, msg.sender);
    
    return bm.assignNewBooster(coId, user, cardIds);
  }
  
  function openBoosterFromCollection(address user, string memory coName) external returns (string[] memory) {
    uint32 coId = coNameToCoId[coName];
    string[] memory extIds = bm.openAnyBooster(coId, user);
    for (uint32 i = 0; i < extIds.length; i++) {
      collections[coId].assignNewCard(msg.sender, extIds[i]);
    }
    for (uint32 i = 0; i < extIds.length; i++) {
      console.log('openBoosterFromCollection', extIds[i]);
    }
    emit BoosterOpened(user, coName, extIds);
    return extIds;
  }
  
  function getBoostersOf(address user) external view returns (uint32[] memory) {
    return bm.getBoosterCountPerCollection(user, count);
  }
  
  function buyBooster(string memory coName, address payable seller, address buyer) external payable {
    return bm.buyAnyBooster(coNameToCoId[coName], seller, buyer);
  }
  
}
