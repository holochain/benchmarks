import {expect} from 'chai'

const HoloWhitelist = artifacts.require('./HoloWhitelist.sol');
const debug = false;

import {
    contractShouldThrow,
    firstEvent
} from './testHelper'
let a;

contract('HoloWhitelist', (accounts) => {
    a = accounts;
    let owner = accounts[0]
    let updater = accounts[1]
    let funder1 = accounts[2]
    let funder2 = accounts[3]
    let funder3 = accounts[4]
    let funder4 = accounts[5]
    let funder5 = accounts[6]
    let funder6 = accounts[7]

    let totalGas = 0;
    let inc = (receipt) => {if (debug) console.log("gas used: "+receipt.gasUsed);totalGas += receipt.gasUsed;};

    let instance;

    beforeEach(async () => {
        instance = await HoloWhitelist.new();

        //    instance = await HoloWhitelist.deployed()
    });

    describe("benchmarking", () => {
        let x;
        it('calculate gas costs for per address addition to the whitelist', async() => {
            x = await instance.setUpdater(updater);
            if (debug) console.log("\nsetUpdater: ",x);
            inc(x.receipt);

            let addresses = genAddrs(1);
            x = await instance.whitelist(addresses, {from: updater});
            if (debug) console.log("\nwhitelist1: ",x);
            inc(x.receipt);

            addresses =  genAddrs(2);
            let y = await instance.whitelist(addresses, {from: updater});
            if (debug) console.log("\nwhitelist2: ",x);
            inc(y.receipt);

            let perAddrGas = y.receipt.gasUsed -  x.receipt.gasUsed;

            addresses = genAddrs(3);
            x = await instance.whitelist(addresses, {from: updater});
            if (debug) console.log("\nwhitelist3: ",x);
            inc(x.receipt);

            let perAddrGas2 = x.receipt.gasUsed -  y.receipt.gasUsed;

            console.log("perAddrGas1:",perAddrGas,"perAddrGas2:",perAddrGas2,"(these should be the same)");
            console.log("extrapolated cost of 10k whitelist update:",perAddrGas*10000);

        });
        it('find max number of addresses before block gas limit reached', async() => {
            x = await instance.setUpdater(updater);
            let addresses = genAddrs(315);
            x = await instance.whitelist(addresses, {from: updater});
            if (debug) console.log("\nwhitelist315: ",x);
            console.log("\n\nGas Used:"+parseInt(x.receipt.gasUsed));
        });
        contractShouldThrow("on 316 addresses", async () => {
            await instance.setUpdater(updater);
            let addresses = genAddrs(316);
            await instance.whitelist(addresses);
        });
    });



})

function genAddr() {
    var output = '';
    for (var i = 0; i < 20; i++) {
        output += Math.floor(Math.random()*16).toString(16);
    }
    return "0x"+output;
}

function genAddrs(n) {
    var output = [];
    for (var i = 0; i < n; i++) {
        output.push(genAddr());
    }
    return output;
}
