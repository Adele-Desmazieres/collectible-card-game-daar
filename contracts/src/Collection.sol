// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Collection is Ownable, ERC721 {
  string public collectionName; // is unique to each collection
  uint256 public cardCount;
  uint256 public collectionId;
  mapping(uint256 => Card) cidToCard;
  mapping(uint256 => address) cidToOwner;
  // mapping(address => uint256) private ownerToCid;
  
  struct Card {
    uint256 cardId;
    string cardURI; // URI on the API of the data of the card
  }
  
  constructor(string memory _colName) 
  Ownable(msg.sender) ERC721("Pokemon Card", "PKMC") {
    collectionName = _colName;
  }
  
  function getCardURI(uint256 id) public view returns (string memory) {
    return cidToCard[id].cardURI;
  }
  
  // TODO : comprendre comment gérer l'ajout d'une carte de cardURI déjà utilisé. Est-ce qu'on doit l'empêcher avec un require ? Ou l'autoriser pour avoir plusieurs instances différenciables d'une même carte ? 
  function assignNewCard(address owner, string memory cardURI) public returns (uint256) {
    uint256 cardId = cardCount;
    _safeMint(owner, cardId);
    Card memory c = Card({
      cardId: cardId,
      cardURI: cardURI
    });
    cidToCard[cardId] = c;
    cidToOwner[cardId] = owner;
    // ownerToCid[owner].push(cardId);
    
    cardCount++;
    return cardId;
  }
  
  function getNewCard(string memory cardURI) public returns (uint256) {
    return assignNewCard(msg.sender, cardURI);
  }
  
  function getNumberCardsOf(address owner) public view returns (uint256) {
    uint256 nb = 0;
    for (uint256 i = 0; i < cardCount; i++) {
      if (cidToOwner[i] == owner) {
        nb += 1;
      }
    }
    return nb;
  }
  
  // TODO : transfert de carte
    // vérifier avec require() que le owner de la carte est celui qui appelle le transfert
    // vérifier que la carte existe
    
}
