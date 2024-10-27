// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Collection is Ownable, ERC721 {
  string public collectionName; // is unique to each collection
  uint32 public collectionId;
  uint32 public cardCount;
  uint32 public boosterCount;
  mapping(uint32 => Card) cidToCard;
  mapping(uint32 => address) cidToUser; // owner of the card
  mapping(uint32 => Booster) bidToBooster;
  mapping(uint32 => address) bidToUser; // owner of the booster
  
  event cardCreationAssignation(address owner, string extId, address author);
  event boosterCreationAssignation(address owner, uint256 size, address author);
  
  struct Card {
    string extId; // external id, from Pokemon TCG card id
  }
  
  struct Booster {
    string[] extIds;
    bool forsale;
    uint32 price;
  }
  
  constructor(string memory _colName) 
  Ownable(msg.sender) ERC721("Pokemon Card", "PKMC") {
    collectionName = _colName;
    cardCount = 0;
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
  
  // Create a new card with specified external id and assign it to user. 
  function assignNewCard(address user, string memory extId) public returns (uint32) {
    uint32 cid = cardCount;
    _safeMint(user, cid);
    Card memory c = Card({
      extId: extId
    });
    cidToCard[cid] = c;
    cidToUser[cid] = user;
    
    cardCount++;
    emit cardCreationAssignation(user, extId, msg.sender);
    return cid;
  }
  
  // TODO : vérifier que cette opération ne révèle par le contenu du booster
  function assignNewBooster(address user, string[] memory extIds) public returns (uint32) {
    uint32 bid = boosterCount;
    _safeMint(user, bid);
    Booster memory b = Booster({
      extIds: extIds,
      forsale: false,
      price: 0 ether
    });
    bidToBooster[bid] = b;
    bidToUser[bid] = user;
    
    boosterCount++;
    
    emit boosterCreationAssignation(user, extIds.length, msg.sender);
    return bid;
  }
  
  function getNumberCardsOf(address user) public view returns (uint32) {
    uint32 nb = 0;
    for (uint32 i = 0; i < cardCount; i++) {
      if (cidToUser[i] == user) {
        nb += 1;
      }
    }
    return nb;
  }
  
  // Returns the list of ids in a string separated by "\n"
  function getCardsExtIdsOf(address user) public view returns (string memory) {
    string memory extIds = "";
    for (uint32 i = 0; i < cardCount; i++) {
      if (cidToUser[i] == user) {
        extIds = string.concat(extIds, cidToCard[i].extId);
        extIds = string.concat(extIds, "\n");
      }
    }
    return extIds;
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
  
  function getAnyBoosterOf(address user) private view returns (uint32) {
    uint32 bid = 0;
    for (uint32 i = 0; i < boosterCount; i++) {
      if (user == bidToUser[i]) {
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
    for (uint32 i = 0; i < extIds.length; i++) {
      assignNewCard(bidToUser[bid], extIds[i]);
    }
    bidToBooster[bid] = createEmptyBooster();
    bidToUser[bid] = address(0); 
    // do not reduce boosterCounter 
    // so new booster don't have the same id as the last one
    return extIds;
  }
  
  function openAnyBooster(address user) public returns (string[] memory) {
    require(user == msg.sender);
    return openBooster(getAnyBoosterOf(user));
  }
  
  function transferCardTo(uint32 cid, address new_owner) public {
    require(msg.sender == cidToUser[cid]);
    cidToUser[cid] = new_owner;
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
  
  // function setBoosterPrice(uint32 bid, uint32 price)
     
}
