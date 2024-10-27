// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract BoosterManager is Ownable, ERC721 {
  uint32 public boosterCount;
  mapping(uint32 => Booster) bidToBooster;
  mapping(uint32 => address) bidToUser; // owner of the booster
  mapping(uint32 => uint32) bidToCollectionId; // TODO : à initialiser lors des créations de booster
  
  event boosterCreationAssignation(address owner, uint256 size, address author);
  event boosterOpening(address owner, uint32 bid);
  event boosterTransfer(uint32 bid, address from, address to);
  event boosterBuy(uint32 bid, address from, address to);
  
  struct Booster {
    string[] extIds;
    bool forsale;
    uint32 price;
  }

  constructor() Ownable(msg.sender) ERC721("Pokemon Booster", "PKMB") {
    boosterCount = 0;
  }
  
  function createEmptyBooster() private pure returns (Booster memory) {
    Booster memory b = Booster({
      extIds: new string[](0),
      forsale: false,
      price: 0 ether
    });
    return b;
  }

  // TODO : vérifier que cette opération ne révèle par le contenu du booster
  function assignNewBooster(uint32 collectionId, address user, string[] memory extIds) public returns (uint32) {
    uint32 bid = boosterCount;
    _safeMint(user, bid);
    Booster memory b = Booster({
      extIds: extIds,
      forsale: false,
      price: 0 ether
    });
    bidToBooster[bid] = b;
    bidToUser[bid] = user;
    bidToCollectionId[bid] = collectionId;
    boosterCount++;
    emit boosterCreationAssignation(user, extIds.length, msg.sender);
    return bid;
  }
  
  function getNumberBoostersOf(address user) public view returns (uint32) {
    uint32 nb = 0;
    for (uint32 i = 0; i < boosterCount; i++) {
      if (bidToUser[i] == user) {
        nb += 1;
      }
    }
    return nb;
  }
  
  function getAnyBoosterOf(uint32 collectionId, address user) private view returns (uint32) {
    uint32 bid = 0;
    for (uint32 i = 0; i < boosterCount; i++) {
      if (user == bidToUser[i] && collectionId == bidToCollectionId[collectionId]) {
        bid = i;
        break;
      }
    }
    require(user == bidToUser[bid]); // require that a booster has actually been found
    return bid;
  }
    
  // Opens a booster, destroy it and returns its content. 
  function openBooster(uint32 bid) private returns (string[] memory) {
    // require(msg.sender == bidToUser[bid], "booster not assigned to this user");
    string[] memory extIds = bidToBooster[bid].extIds;
    bidToBooster[bid] = createEmptyBooster();
    bidToUser[bid] = address(0); 
    return extIds;
  }
  
  function openAnyBooster(uint32 collectionId, address user) external returns (string[] memory) {
    return openBooster(getAnyBoosterOf(collectionId, user));
  }
  
  // Allow someone to give its booster.
  function transferBoosterTo(uint32 bid, address user) external {
    require(msg.sender == bidToUser[bid]);
    bidToUser[bid] = user;
  }
  
  // msg.sender is the buyer, and the seller has to be the owner of the booster 
  function buyAnyBooster(uint32 collectionId, address payable seller, address buyer) public payable {
    uint32 bid = getAnyBoosterOf(collectionId, seller);
    require(seller == bidToUser[bid]);
    require(buyer == msg.sender);
    Booster memory b = bidToBooster[bid];
    require(b.forsale && b.price >= msg.value);
    bidToUser[bid] = buyer; // change booster ownership
    seller.transfer(msg.value); // give money to the seller
  }
  
  // Set sepcified price and put for sale every boosters from this collection owned by user. 
  function setBoosterCollectionPrice(address user, uint32 collectionId, uint32 price) public {
    require(user == msg.sender);
    for (uint32 i = 0; i < boosterCount; i++) {
      if (bidToUser[i] == user && bidToCollectionId[i] == collectionId) {
        bidToBooster[i].price = price;
        bidToBooster[i].forsale = true;
      }
    }
  }
  
  // Remove from sale boosters of specified collection owned by user. 
  function removeBoosterCollectionPrice(address user, uint32 collectionId) public {
    require(user == msg.sender);
    for (uint32 i = 0; i < boosterCount; i++) {
      if (bidToUser[i] == user && bidToCollectionId[i] == collectionId) {
        bidToBooster[i].price = 0;
        bidToBooster[i].forsale = false;
      }
    }
  }
  
  function getBoosterCountPerCollection(address user, uint32 nbCollections) public view returns 
  (uint32[] memory) {
    uint32[] memory counts = new uint32[](nbCollections); // counter is at index of its collection id
    for (uint32 i = 0; i < boosterCount; i++) {
      if (bidToUser[i] == user) {
        uint32 collectionId = bidToCollectionId[i];
        counts[collectionId] += 1;
      }
    }
    return counts;
  }

}
