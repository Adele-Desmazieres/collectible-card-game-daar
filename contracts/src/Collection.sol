// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collection is Ownable, ERC721 {
  string public collectionName; // is unique to each collection
  uint32 public collectionId;
  uint32 public cardCount;
  uint32 public boosterCount;
  mapping(uint32 => Card) cidToCard;
  mapping(uint32 => address) cidToUser; // owner of the card
  mapping(uint32 => Booster) bidToBooster;
  mapping(uint32 => address) bidToUser; // owner of the booster
  
  struct Card {
    uint32 cardId;
    string cardURL; // URL on the API of the data of the card
    bool exists;
  }
  
  struct Booster {
    string[] cardURLs;
    bool exists;
  }
  
  constructor(string memory _colName) 
  Ownable(msg.sender) ERC721("Pokemon Card", "PKMC") {
    collectionName = _colName;
  }
  
  function getCollectionName() public view returns (string memory) {
    return collectionName;
  }
  
  function getCardURL(uint32 id) public view returns (string memory) {
    require(cidToCard[id].exists == true);
    return cidToCard[id].cardURL;
  }
  
  function makeEmptyBooster() internal pure returns (Booster memory) {
    Booster memory b = Booster({
      cardURLs: new string[](0),
      exists: false
    });
    return b;
  }
  
  function getNewCard(string memory cardURL) public onlyOwner returns (uint32) {
    return assignNewCard(msg.sender, cardURL);
  }
  
  // Crée une nouvelle carte avec l'URL spécifié
  // TODO : rendre cette fonction interne ? (nécessesite de créer une autre fonction interface pour que le main puisse l'appeler)
  function assignNewCard(address user, string memory cardURL) public returns (uint32) {
    uint32 cardId = cardCount;
    _safeMint(user, cardId);
    Card memory c = Card({
      cardId: cardId,
      cardURL: cardURL,
      exists: false
    });
    cidToCard[cardId] = c;
    cidToUser[cardId] = user;
    
    cardCount++;
    return cardId;
  }
  
  // TODO : vérifier que cette opération ne révèle par le contenu du booster
  function assignNewBooster(address user, string[] memory cardURLs) public returns (uint32) {
    uint32 boosterId = boosterCount;
    _safeMint(user, boosterId);
    Booster memory b = Booster({
      cardURLs: cardURLs,
      exists: true
    });
    bidToBooster[boosterId] = b;
    bidToUser[boosterId] = user;
    
    boosterCount++;
    return boosterId;
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
  
  // Returns the list of urls in a string separated by "\n"
  function getCardsUrlsOf(address user) public view returns (string memory) {
    string memory urls;
    for (uint32 i = 0; i < cardCount; i++) {
      if (cidToUser[i] == user && cidToCard[i].exists == true) {
        urls = string.concat(urls, cidToCard[i].cardURL);
        urls = string.concat(urls, "\n");
      }
    }
    return urls;
  }

  function getNumberBoostersOf(address user) public view returns (uint32) {
    uint32 nb = 0;
    for (uint32 i = 0; i < boosterCount; i++) {
      if (bidToUser[i] == user && bidToBooster[i].exists == true) {
        nb += 1;
      }
    }
    return nb;
  }
  
  // Opens a booster, destroy it, creates new cards and gives them to the booster owner
  function openBooster(uint32 bid) public returns (string[] memory) {
    require(msg.sender == bidToUser[bid]);
    require(bidToBooster[bid].exists == true);
    
    string[] memory cardURLs = bidToBooster[bid].cardURLs;
    for (uint32 i = 0; i < cardURLs.length; i++) {
      assignNewCard(bidToUser[bid], cardURLs[i]);
    }
    bidToBooster[bid] = makeEmptyBooster();
    bidToUser[bid] = address(0); 
    // do not reduce boosterCounter 
    // so new booster don't  have the same id as the last one
    return cardURLs;
  }
  
  // Transfert une carte à quelqu'un
  function transferCardTo(uint32 cid, address new_owner) public {
    require(msg.sender == cidToUser[cid]); // TODO : choose if admin can also do it
    require(cidToCard[cid].exists == true);
    
    cidToUser[cid] = new_owner;
  }
  
  function transferBoosterTo(uint32 bid, address new_owner) public {
    require(msg.sender == bidToUser[bid]); // TODO : choose if admin can also do it
    require(bidToBooster[bid].exists == true);
    
    bidToUser[bid] = new_owner;
  }

  
  // TODO utiliser les Events pour éviter d'avoir à attendre le rafraichissement de la blockchain ?
     
}
