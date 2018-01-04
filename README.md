# benchmarks

This repo contains a set of benchmarks that measure the cost in gas for set of Ethereum smart contracts, and the cpu/bandwith/storage usage of Holochain applications that accomplish the same tasks.

The purpose of these comparisons is to establish an initial "holochain compute unit (HCU)" that consists of a specific amount of CPU, bandwidth and storage usage, that we can use to establish the initial value of 1 HOLO, the mutual credit currency that will be used by hosters on the Holo platform to charge for hosting.  At launch time, we will provide 1 such unit of computing for 1 HOLO.  We expect others to undercut our price.

Because the architectures of Blockchain/Ethereum are so different we acknowledge right here at the top, and these comparisons are not apples-to-apples.

## Pricing Mechanics and Evolution
### hosters set their own prices
### displaying average prices
### charging per application by it's usage profile

## Issues that make comparison tricky

### On-chain storage
- very expensive in ETH costs, leads to non-decentralized solutions (hashes and off chain storage)

### Read
- free for Ethereum (no gas cost)
- not free in Holo

### Cost differences between CPU/Storage/Bandwith/Memory
- location dependent
- application dependent
- hardware dependent

### Resilience Factor
### Gossip

## Methodology

1) _Scenarios_:  We have created scenarios of usage of the Smart Contract/Holochain Application, for example for the DAO application the scenario consists of an owner setting up a fixed number of members of the DAO, the members then create and voting on proposal and finalize them.

2) Measuring costs of gas for ETH Smart Contracts:  We use the truffle test environment and sum up the costs of gas of all the transactions involved in the scenarios.  We report these values as the cost.

3) Measuring computing usage of Holochain Applications:  We have added in benchmarking code directly into Holochain core that is activated by the scenario system of our Test Driven Development framework.  This code measures:
 - storage by the number of bytes used in agents' source chains and stored in their DHT databases
 - bandwith by counting the number of bytes sent by all agents.
 - cpu usage as measured by the https://github.com/shirou/gopsutil library on a quad-core Thinkpad P51s laptop running ubuntu 16.04

## Benchmark Scenarios

### ICO Whitelist
At common use-case for Ethereum is an ICO.  Current banking regulations require that organization know about their customers before accepting funds from them.  In the world of pseudo-anonymous crypto-currency this regulation can honored by creating a white-list process where customers verify their identity and provide a wallet from which they will be sending funds.  This wallet is then stored on the blockchain in a white-list, and tested by the a smart-contract in allowing the minting of coins in the ICO.

For our own ICO we have used this exact procedure, so this a real-world example, and in this scenario we use our whitelist contract exactly as deployed for our own ICO.  In this scenario we measure the costs of adding 10000 addresses to a whitelist.

#### Comparison Caveats
- ETH block size limitations
- Resilience choice (i.e. nodes gossiping)

#### Results
- _Ethereum:_ In this scenario we make three transactions with the contract of 1, 2 and 3 addresses to add to the white-list, and use the difference in gas used to find the per-address write cost, and then extrapolate to find the cost for 10000 addresses.  Finally we run tests just to show that maximum number of addresses that fit in a block given gas/block limitations is 315

``` shell
$ cd approvedList/whitelist
$ truffle test
Using network 'test'.

  Contract: HoloWhitelist
    benchmarking
perAddrGas1: 21255 perAddrGas2: 21255 (these should be the same)
extrapolated cost of 10k whitelist update: 212550000
      ✓ calculate gas costs for per address addition to the whitelist (128ms)


Gas Used:6716481
      ✓ find max number of addresses before block gas limit reached (639ms)
      Contract:
        Contract:
          ✓ on 316 addresses (78ms)

```

- _Holochain:_ In this scenario a writer node creating an array of 10K entries and 10 reader nodes that wait 5 seconds for gossip propigation and then read the list.

Here's the output of running the test:

``` shell

$ cd approvedList
$ hcdev -mdns=true -no-nat-upnp scenario -benchmarks benchmark | perl ../bench.pl
Total chain: 556.23
Total DHT: 6340.86
Total Bytes Sent: 6306.16
Total CPU: 3700

```

### DAO
One of the most exciting applications of the distributed computing is Distributed Autonomous Organizations.  The Ethereum website provides a sample DAO smart contract.  We have ported that smart contract as a  Holochain application.

In this scenario for both the Ethereum and Holochain contexts we assume the same number of agents, an owner, 4 members of party A, 3 members of party B, and a proposal implementer (the agent who gets paid).  In the scenario the owner first creates all the members.  Then all the members of party A create a proposal fund it, and vote in favor of it, while all members of party B vote against the proposal.  Because there are more members of party A the proposals all pass when the implementer executes the proposal, and gets funds from it.

#### Comparison Caveats
- proposal size:
- mutual credit currency instead of ETH transaction fabric

#### Results

- _Ethereum:_
For prosposals with 1k in the proposal text:
``` shell
$ truffle test
...

Total Gas Used:9109388
      ✓ should run the benchmarks (6568ms)
```

For proposals with 0 bytes in the proposal text:
``` shell
$ truffle test
...

Total Gas Used:6157696
      ✓ should run the benchmarks (6568ms)
```
_
- _Holochain:_  In this scenario the test runs for a total of 20 seconds real time.

For prosposals with 1k in the proposal text:
``` shell
$ cd dao
$ hcdev -mdns=true -no-nat-upnp scenario -benchmarks benchmark | perl ../bench.pl
Total chain: 49.9
Total DHT: 1428.49
Total Bytes Sent: 20676.51
Total CPU: 43990
```

For prosposals with 10bytes in the proposal text:
``` shell
$ cd dao
$ hcdev -mdns=true -no-nat-upnp scenario -benchmarks benchmark | perl ../bench.pl
Total chain: 45.22
Total DHT: 1400.47
Total Bytes Sent: 21075.87
Total CPU: 48030
```
