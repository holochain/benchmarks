pragma solidity ^0.4.11;

import "./Sorter.sol";

contract Client {

  uint[] private data;

  function setData(uint[] _data) external {
    data = _data;
  }

  function getElement(uint index) returns(uint) {
    return data[index];
  }

  function sort() {
    Sorter.sort(data);
  }


}