var _ = require("underscore");
import {
    contractShouldThrow
} from './testHelper'

var InsertionSorter          = artifacts.require("./InsertionSorter.sol");
var QuickSorter              = artifacts.require("./QuickSorter.sol");
var Client                   = artifacts.require("./Client.sol");

const DATA = {
    10: [3, 7, 4, 2, 1, 9, 8, 6, 5, 0],
    25: [39, 51, 29, 14, 3, 11, 69, 93, 82, 36, 8, 72, 20, 24, 24, 42, 86, 48, 21, 52, 14, 83, 36, 6, 74],
    50: [64, 61, 48, 59, 100, 23, 64, 94, 25, 37, 81, 46, 28, 96, 46, 75, 98, 97, 91, 83, 46, 11, 30, 15, 71, 38, 83, 64, 11, 96, 94, 89, 99, 22, 46, 41, 14, 81, 68, 10, 63, 4, 44, 30, 90, 84, 25, 10, 55, 93],
    100: [47, 6, 31, 33, 51, 100, 7, 26, 94, 76, 11, 57, 40, 37, 45, 62, 56, 98, 98, 40, 1, 23, 17, 97, 13, 72, 56, 97, 20, 16, 79, 13, 17, 62, 55, 86, 34, 18, 2, 60, 66, 30, 100, 39, 25, 23, 58, 1, 55, 46, 25, 6, 82, 64, 73, 74, 84, 29, 38, 19, 75, 89, 62, 21, 3, 96, 21, 64, 82, 2, 46, 59, 31, 37, 76, 47, 77, 83, 7, 11, 26, 30, 88, 69, 32, 2, 48, 77, 61, 10, 60, 27, 7, 30, 93, 50, 56, 36, 77, 34],
    200: [936, 345, 292, 7, 637, 52, 437, 784, 694, 3, 366, 681, 58, 355, 602, 144, 328, 593, 681, 872, 555, 65, 565, 833, 416, 582, 371, 408, 267, 906, 678, 678, 760, 105, 827, 401, 747, 869, 434, 521, 388, 891, 450, 725, 411, 91, 102, 166, 606, 534, 311, 243, 900, 961, 823, 483, 972, 412, 241, 820, 184, 378, 987, 484, 495, 185, 554, 822, 585, 536, 597, 798, 295, 81, 507, 609, 747, 535, 747, 131, 872, 332, 890, 391, 507, 746, 774, 351, 878, 5, 129, 366, 916, 822, 18, 200, 526, 172, 301, 834, 760, 72, 225, 646, 931, 488, 362, 384, 226, 540, 906, 505, 702, 299, 546, 317, 339, 63, 386, 219, 47, 989, 778, 13, 414, 265, 964, 266, 612, 35, 143, 494, 502, 51, 547, 236, 582, 448, 595, 108, 735, 756, 265, 574, 856, 486, 431, 473, 595, 120, 319, 78, 362, 213, 566, 815, 217, 658, 967, 9, 608, 62, 620, 639, 243, 42, 924, 817, 675, 852, 862, 599, 458, 866, 591, 372, 707, 338, 241, 874, 282, 217, 629, 849, 430, 781, 442, 525, 619, 727, 75, 285, 998, 57, 1000, 316, 884, 536, 859, 772]
};

contract('Soriting algorithms', function() {

    var checkSort = async function (client, data) {
        var arr = _.range(0, data.length);
        Promise.all(arr.map(async(i) => {
            arr[i] = await client.getElement.call(i);
        }));
        for (var i = 1; i < arr.length; i++) {
            assert.ok(arr[i] >= arr[i - 1], "Data isn't sorted correctly");
        }
    };

    var sortData = async function (client, data) {
        await client.setData(data);
        let tx = await client.sort();
        console.log("Gas [" + data.length + " elements]: " + tx.receipt.gasUsed);
    };

    var testScenario = async function (sorter, data) {
        let deployedSorter = await sorter.deployed();
        Client.link("Sorter", deployedSorter.address);
        let client = await Client.new();
       // console.log(data)
        await sortData(client, data);
        await checkSort(client, data);
    };

    describe('Insertion Sort algorithm:', async function () {

        it("should sort 10 elements with insertion Sort", async function () {
            await testScenario(InsertionSorter, DATA[10]);
        });

        it("should sort 25 elements with insertion Sort", async function () {
            await testScenario(InsertionSorter, DATA[25]);
        });

        it("should sort 50 elements with insertion Sort", async function () {
            await testScenario(InsertionSorter, DATA[50]);
        });

        it("should sort 100 elements with insertion Sort", async function () {
            await testScenario(InsertionSorter, DATA[100]);
        });

        it("should sort 200 elements with insertion Sort", async function () {
            await testScenario(InsertionSorter, DATA[200]);
        });
    });

    describe('Quick Sort algorithm:', async function () {

        it("should sort 10 elements with Quick Sort", async function () {
            await testScenario(QuickSorter, DATA[10]);
        });

        it("should sort 25 elements with Quick Sort", async function () {
            await testScenario(QuickSorter, DATA[25]);
        });

        it("should sort 50 elements with Quick Sort", async function () {
            await testScenario(QuickSorter, DATA[50]);
        });

        it("should sort 100 elements with Quick Sort", async function () {
            await testScenario(QuickSorter, DATA[100]);
        });

        it("should sort 200 elements with Quick Sort", async function () {
            await testScenario(QuickSorter, DATA[200]);
        });

    });
/*

    describe('Quick Sort algorithm2:', async function () {

        it("should sort 331 elements with Quick Sort", async function () {
            await testScenario(QuickSorter, genArray(331));
        });
        contractShouldThrow("on 332 items", async () => {
            await testScenario(QuickSorter, genArray(332));
        });
    });
*/

});

function genArray(n) {
    var output = [];
    for (var i = 0; i < n; i++) {
        var value = Math.floor(Math.random()*100);
        output.push(value);
    }
    return output;
}
