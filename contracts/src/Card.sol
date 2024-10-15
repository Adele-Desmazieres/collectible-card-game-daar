// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Extension.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Card is Ownable {
	
	address owner;
	Extension extension;
	
	constructor(address initialOwner) {
		
	}
	
}

