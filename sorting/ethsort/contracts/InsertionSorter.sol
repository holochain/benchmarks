pragma solidity ^0.4.11;

library InsertionSorter {


  function sort(uint[] storage data) {

    uint n = data.length;
    uint[] memory arr = new uint[](n);
    uint i;

    for(i=0; i<n; i++) {
      arr[i] = data[i];
    }

    uint key;
    uint j;

    for(i = 1; i < arr.length; i++ ) {
      key = arr[i];

      for(j = i; j > 0 && arr[j-1] > key; j-- ) {
        arr[j] = arr[j-1];
      }

      arr[j] = key;
    }

    for(i=0; i<n; i++) {
      data[i] = arr[i];
    }

  }

}