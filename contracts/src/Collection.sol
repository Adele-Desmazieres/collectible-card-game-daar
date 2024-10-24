// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collection is Ownable, ERC721 {
  string public collectionName; // is unique to each collection
  uint256 public collectionId;
  uint256 public cardCount;
  uint256 public boosterCount;
  mapping(uint256 => Card) cidToCard;
  mapping(uint256 => address) cidToUser; // owner of the card
  mapping(uint256 => Booster) bidToBooster;
  mapping(uint256 => address) bidToUser; // owner of the booster
  
  struct Card {
    uint256 cardId;
    string cardURI; // URI on the API of the data of the card
  }
  
  struct Booster {
    string[] cardURIs;
  }
  
  constructor(string memory _colName) 
  Ownable(msg.sender) ERC721("Pokemon Card", "PKMC") {
    collectionName = _colName;
  }
  
  function getCollectionName() public view returns (string memory) {
    return collectionName;
  }
  
  function getCardURI(uint256 id) public view returns (string memory) {
    return cidToCard[id].cardURI;
  }
  
  function getEmptyBooster() internal pure returns (Booster memory) {
    Booster memory b = Booster({
      cardURIs: new string[](0)
    });
    return b;
  }
    
  // Crée une nouvelle carte avec l'URI spécifié
  // TODO : rendre cette fonction interne ? (nécessesite de créer une autre fonction interface pour que le main puisse l'appeler)
  function assignNewCard(address user, string memory cardURI) public returns (uint256) {
    uint256 cardId = cardCount;
    _safeMint(user, cardId);
    Card memory c = Card({
      cardId: cardId,
      cardURI: cardURI
    });
    cidToCard[cardId] = c;
    cidToUser[cardId] = user;
    
    cardCount++;
    return cardId;
  }
  
  // TODO : vérifier que cette opération ne révèle par le contenu du booster
  function assignNewBooster(address user, string[] memory cardURIs) public returns (uint256) {
    uint256 boosterId = boosterCount;
    _safeMint(user, boosterId);
    Booster memory b = Booster({
      cardURIs: cardURIs
    });
    bidToBooster[boosterId] = b;
    bidToUser[boosterId] = user;
    
    boosterCount++;
    return boosterId;
  }
  
  function getNewCard(string memory cardURI) public returns (uint256) {
    return assignNewCard(msg.sender, cardURI);
  }
  
  function getNumberCardsOf(address user) public view returns (uint256) {
    uint256 nb = 0;
    for (uint256 i = 0; i < cardCount; i++) {
      if (cidToUser[i] == user) {
        nb += 1;
      }
    }
    return nb;
  }
  
  // TODO : renvoyer plutot un tableau de strings, en initialisant le tableau à sa taille fixe (qui est le nombre de cartes du user dans cette collection)
  function getCardsUrlsOf(address user) public view returns (string memory) {
    string memory cards = "";
    for (uint256 i = 0; i < cardCount; i++) {
      if (cidToUser[i] == user) {
        cards = string.concat(cards, cidToCard[i].cardURI);
        cards = string.concat(cards, "\n");
      }
    }
    return cards;
  }

  function getNumberBoostersOf(address user) public view returns (uint256) {
    uint256 nb = 0;
    for (uint256 i = 0; i < boosterCount; i++) {
      if (bidToUser[i] == user) {
        nb += 1;
      }
    }
    return nb;
  }
  
  // TODO : ajouter require le sender est le owner du booster
  function openBooster(uint256 bid) public returns (string[] memory) {
    string[] memory cardURIs = bidToBooster[bid].cardURIs;
    for (uint i = 0; i < cardURIs.length; i++) {
      assignNewCard(bidToUser[bid], cardURIs[i]);
    }
    bidToBooster[bid] = getEmptyBooster();
    bidToUser[bid] = address(0);
    
    // TODO : vérifier que ce que j'ai écrit à 00:32 est correct, et qu'il ne reste pas de moyen d'ouvrir un booster déjà ouvert !!!
    return cardURIs;
  }
  
  // TODO : transfert de carte
    // vérifier avec require() que le user de la carte est celui qui appelle le transfert
    // vérifier que la carte existe
  
  // TODO utiliser les Events pour éviter d'avoir à attendre le rafraichissement de la blockchain
     
}
