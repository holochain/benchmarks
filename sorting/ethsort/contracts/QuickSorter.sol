pragma solidity ^0.4.11;

library QuickSorter {


  function sort(uint[] storage data) {

    uint n = data.length;
    uint[] memory arr = new uint[](n);
    uint i;

    for(i=0; i<n; i++) {
      arr[i] = data[i];
    }

    uint[] memory stack = new uint[](n+2);

    //Push initial lower and higher bound
    uint top = 1;
    stack[top] = 0;
    top = top + 1;
    stack[top] = n-1;

    //Keep popping from stack while is not empty
    while (top > 0) {

      uint h = stack[top];
      top = top - 1;
      uint l = stack[top];
      top = top - 1;

      i = l;
      uint x = arr[h];

      for(uint j=l; j<h; j++){
        if  (arr[j] <= x) {
          //Move smaller element
          (arr[i], arr[j]) = (arr[j],arr[i]);
          i = i + 1;
        }
      }
      (arr[i], arr[h]) = (arr[h],arr[i]);
      uint p = i;

      //Push left side to stack
      if (p > l + 1) {
        top = top + 1;
        stack[top] = l;
        top = top + 1;
        stack[top] = p - 1;
      }

      //Push right side to stack
      if (p+1 < h) {
        top = top + 1;
        stack[top] = p + 1;
        top = top + 1;
        stack[top] = h;
      }
    }

    for(i=0; i<n; i++) {
      data[i] = arr[i];
    }
  }

}