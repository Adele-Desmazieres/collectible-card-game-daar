// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

import "./CardSet.sol";

contract Card is Ownable, ERC721 {
  string data; // les données en format JSON
  string img; // url de l'image

  constructor(
    address owner,
    string memory _data,
    string memory _img
  ) Ownable(owner) ERC721("Pokemon Card", "PKMC") {
    data = _data;
    img = _img;
  }

  function assignCard(
    address new_owner,
    string memory tokenUri
  ) public returns (uint256) {}
}
