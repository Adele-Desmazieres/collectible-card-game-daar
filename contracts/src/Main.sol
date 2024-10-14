// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Extension.sol";

contract Main {
  int private count;
  mapping(int => Extension) private extensions;

  constructor() {
    count = 0;
  }

  function createExtension(string calldata name, int cardCount) external {
    extensions[count++] = new Extension(name, cardCount);
  }
}
