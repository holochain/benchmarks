pragma solidity ^0.4.11;

library Sorter {

    function sort(uint[] storage data);




//    function quickSort(uint left, uint right) internal {
//        uint i = left;
//        uint j = right;
//        uint pivot = data[left + (right - left) / 2];
//        while (i <= j) {
//            while (data[i] < pivot) i++;
//            while (pivot < data[j]) j--;
//            if (i <= j) {
//                (data[i], data[j]) = (data[j], data[i]);
//                i++;
//                j--;
//            }
//        }
//        if (left < j) quickSort(left, j);
//        if (i < right) quickSort(i, right);
//    }
//
//    function swap(uint i, uint j) {
//        var tmp = data[i];
//        data[i] = data[j];
//        data[j] = tmp;
//    }
//
//    function max_heapify(uint i, uint length) {
//        while (true) {
//            var left = i*2 + 1;
//            var right = i*2 + 2;
//            var largest = i;
//
//            if (left < length && data[left] > data[largest]) {
//                largest = left;
//            }
//
//            if (right < length && data[right] > data[largest]) {
//                largest = right;
//            }
//
//            if (i == largest) {
//                break;
//            }
//
//            swap(i, largest);
//            i = largest;
//        }
//    }
//
//    function heapify(uint length) {
//        uint i = length/2;
//        while (true) {
//            max_heapify(i, length);
//            if (i == 0) break;
//            i--;
//        }
//    }
//
//    function heapSort() {
//        heapify(data.length);
//        var i = data.length-1;
//        while(i > 0) {
//            swap(i, 0);
//            max_heapify(0, i-1);
//            i--;
//        }
//    }

}