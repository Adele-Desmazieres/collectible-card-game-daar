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
    require(bidToUser[bid] == user);
    return bid;
  }
    
  // Opens a booster, destroy it, creates new cards and gives them to the booster owner
  function openBooster(uint32 bid) private returns (string[] memory) {
    require(msg.sender == bidToUser[bid]);
    string[] memory extIds = bidToBooster[bid].extIds;
    bidToBooster[bid] = createEmptyBooster();
    bidToUser[bid] = address(0); 
    return extIds;
  }
  
  function openAnyBooster(uint32 collectionId, address user) public returns (string[] memory) {
    require(user == msg.sender);
    return openBooster(getAnyBoosterOf(collectionId, user));
  }
  
    function transferBoosterTo(uint32 bid, address new_owner) public {
    require(msg.sender == bidToUser[bid]);
    bidToUser[bid] = new_owner;
  }
  
  function buyBooster(uint32 bid) public payable {
    Booster memory b = bidToBooster[bid];
    require(msg.sender == bidToUser[bid]);
    require(b.forsale && b.price == msg.value);
    bidToUser[bid] = msg.sender;
  }
  
  // TODO
  // function setBoosterPrice(uint32 bid, uint32 price)
  

}