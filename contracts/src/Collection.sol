// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Collection is Ownable, ERC721 {
  string public coName; // is unique to each collection
  uint32 public coId;
  uint32 public cardCount;
  mapping(uint32 => Card) cidToCard;
  mapping(uint32 => address) cidToUser; // owner of the card
  
  event cardCreationAssignation(address owner, string extId, address author);
  
  struct Card {
    string extId; // external id, from Pokemon TCG card id
  }
  
  constructor(string memory _colName) 
  Ownable(msg.sender) ERC721("Pokemon Card", "PKMC") {
    coName = _colName;
    cardCount = 0;
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

  function transferCardTo(uint32 cid, address new_owner) public {
    require(msg.sender == cidToUser[cid]);
    cidToUser[cid] = new_owner;
  }
       
}
