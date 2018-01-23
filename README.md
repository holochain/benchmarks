# Holo Value Benchmarks

### Summary:
This repo contains benchmarks for comparing the *price* of computation in Ethereum vs. Holochain. For each benchmark we have some functionality coded as an Ethereum smart contract and parallel functionality coded as an app that accomplishes the same task on Holochain, an alternative distributed computing framework.

In the case of Ethereum, we can easily identify how much gas it takes to accomplish the tasks and then look to [Ethereum gas station](#) for data about the average gas price you would pay and how long it would take to run.

In the case of a Holochain app, we use our scenario testing framework to run many simultaneous nodes emulating the interactions of a decentralized network of peers running it (since there's not a real network of people running benchmarks). We can measure how much work each node has to do as measured in milliseconds of CPU usage, bandwidth, storage as well as the gossip activity between nodes for synchronization.

### Context:
Once Holo launches and nodes are providing hosting services, they will set their own prices so the market will determine how much hosting power the Holo currency buys. However, in advance of that time, we need to set a starting point for the pre-sale of the currency.

We see the market for hosting resilient applications as a spectrum spread across a few dimensions.
 - **Centralization:**
  - *Single server* hosting is completely centralized (and not very resilient).
  - *Cloud hosting* on is less centralized and more resilient, in that the cloud provider may be spreading parts of your load across different servers and possibly different data centers, but is still typically centralized to a single live data source, and proprietary gossip and coordination inside their private network.
  - *Ethereum smart contracts* run on a network of approximately 26,000 mining nodes all updating the shared state of a global blockchain ledger.
  - *Holochain* apps are fully distributed / peer to peer and comprise an ecosystem of networks validating a sharded DHT.
 - **Performance:**
 - **Price:**


### Benchmarking Purpose:
We have to set an initial price for the sale of Holo fuel for our ICO. Holo fuel will be used to buy hosting services from Holo hosts. Those hosters charge for the computing power they provide by billing for CPU, bandwidth, and storage they provide.  In some senses, the price we charge for Holo fuel can be arbitrary because hosters can set their own prices (in Holo fuel) for the computing they provide, however, to jump start the network, Holo will also be providing hosting at a particular pre-declared price.  We have to set a price that:
1. which provides ample value so people will want to participate in the ICO
2. we can guarantee to deliver at
3. we believe hosters can undercut and thus provide an expanding ecosystem of hosting

Because Ethereum provides distributing computing at a cost that people are actually paying now, it seems reasonable to believe that if we can undercut that price by a wide margin (10K) that's ample incentive for people to participate in the ICO.  These benchmarks indicate to us that we can indeed deliver hosting at that 10K margin from Ethereum, and that others will be able to do better.

Thus, we arbitrarily declare that we will set the price of 10,000 Holo fuel at 1 Euro, and that for that 1 Euro's worth of Holo fuel, you will get as much computing as 10,000 Euros would buy you on Ethereum as demonstrated by the benchmarking tests below.  These tests will demonstrate how much CPU, storage and bandwidth Holochain uses to accomplish those task, and from that data we set exactly how much computing you get for 1 Holo fuel (or HOT as its proxy in the ICO).

## Issues that make comparison tricky

Because the architectures of Blockchain/Ethereum are so different we acknowledge right here at the top, and these comparisons are not apples-to-apples, however they do provide sufficient data to set the initial amount of computing you get for 1 Holo fuel unit.  Here are some of the challenges in making the comparison:

### Gas price fluctuation
Over the time in which we built out these benchmarks we have seen standard [gas prices](https://ethgasstation.info/index.php) fluctuate between 4-90 Gwei.  For the purposes of choosing our standard compute unit, we averaged the gas prices for the all the days of Jan 2018 before the launch of our ICO.

### Read vs. Write
For both Ethereum and Holo, there is a difference in real world costs for read vs. write.  In the case of  Ethereum all of the cost paid by participants has been shifted to write, i.e. to changing state, and all read transactions are free.  This is despite the fact that there are real costs in the world for read operations on the Etherum, it's just that the community treats them as overhead.

For Holo both read & write transactions will carry a cost, though read transactions will be significantly cheaper because they don't trigger as much activity on the network.  For Holochain there are also 'uncharged' costs that the community will have to bear as overhead. The mostly relate to the gossip that nodes need to perform to maintain the sharding replication for resilience.

### Cost differences between CPU/Storage/Bandwith/Memory
We recognize that different hosters have different costs associated with the different aspects of providing computing, and that therefore they will want to set pricing differentially according to the different profiles of the applications.  From our benchmarks below you can see that some applications storage heavy, others are bandwidth heavy, and others are CPU intensive.  For the purposes of this benchmark we simply lump all of this together to find a starting compute value, that we expect will be very easy for hosters to undercut.

### Gossip & Resillience
A significant porition of the computing overhead in Holochain is attributable to gossip which establishes and maintains the sharded copies of all the application data.  Factoring in this cost into the Holo fuel pricing is very difficult ahead of real-world use cases.  In our benchmarking we have recorded how much of the bandwidth use was due to gossip and simply lumped it into the total.  When Holo launches these overhead costs may be separated out to be accounted for using other methods for more precise value accounting.

## Pricing Mechanics and Evolution
### hosts set their own prices
### displaying average prices
### charging per application by it's usage profile



## Comparison Methodology

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

#### Result
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
$ perl ../benchmark.pl
...
Total chain: 556.23K
Total DHT: 6342.196K
Total Bytes Sent: 6214.686K
Total Gossip Sent: 122.416K
Total CPU: 6082ms

```

### DAO
One of the most exciting applications of the distributed computing is Distributed Autonomous Organizations.  The Ethereum website provides a sample DAO smart contract.  We have ported that smart contract as a  Holochain application.

In this scenario for both the Ethereum and Holochain contexts we assume the same number of agents, an owner, 4 members of party A, 3 members of party B, and a proposal implementer (the agent who gets paid).  In the scenario the owner first creates all the members.  Then all the members of party A create a proposal fund it, and vote in favor of it, while all members of party B vote against the proposal.  Because there are more members of party A the proposals all pass when the implementer executes the proposal, and gets funds from it.

#### Comparison Caveats
- proposal size:
- mutual credit currency instead of ETH transaction fabric

#### Results

For proposals with 0 bytes in the proposal text:
``` shell
$ truffle test
...

Total Gas Used:6157696
      ✓ should run the benchmarks (6568ms)
```

- _Ethereum:_
For prosposals with 1k in the proposal text:
``` shell
$ truffle test
...

Total Gas Used:9109388
      ✓ should run the benchmarks (6568ms)
```

- _Holochain:_  In this scenario the test runs for a total of 20 seconds real time.

For prosposals with 10bytes in the proposal text:
``` shell
$ cd dao
$ perl ../benchmark.pl

...
Total chain: 45.22K
Total DHT: 1316.313K
Total Bytes Sent: 15843.621K
Total Gossip Sent: 9274.803K
Total CPU: 48721ms
```

For prosposals with 1k in the proposal text:
``` shell
$ cd dao
$ perl ../benchmark.pl

...
Total chain: 49.54K
Total DHT: 1363.782K
Total Bytes Sent: 16685.8K
Total Gossip Sent: 9928.417K
Total CPU: 50874ms
```

As you see, for Holo although there is an increase in cost, as the data size increase, it isn't nearly as significant as it is for Ethereum.

### Social Media Twitter Clone

In this scenario we examine the actual costs in gas incurred by users of the Ethereum social media Twitter clone [leeroy](https://leeroy.io), and we measure the compute resources used by our own Twitter clone [Clutter](https://github.com/Holochain/clutter).

#### Results

- _Ethereum:_ The  [leeroy](https://leeroy.io) twitter clone is fully operational and people are joining it and making posts which have significant real-world costs.  We don't have the solidity code available for direct inspection and creating an identical scenario in truffle, as we did above.  However zippy joined the network and made a post.  Here is the [transaction hash](https://etherscan.io/tx/0x4ee9b970dabcbb469bfacae71354e7d161b8a9c8787b725d9ded3232c897b110) of the registerUsername call when zippy became a user.  This call used 70726 gas with "Actual Tx Cost/Fee" at 26gwei of 0.001838876 Ether ($1.85) on the day it was made.  And here is is the [transaction hash](https://etherscan.io/tx/0x0803f139fb73f5a0cfbfdf102d29ffd9464bb05ee752de41a676db531ca1889d) for zippy's first post.  It used 25721 gas "Actual Tx Cost/Fee" at 3 Gwei of 0.00077163 Ether ($0.78).

- _Holochain:_ In this scenario one user, Jane, joins the network and makes a post.  Ten other users join the network, follow Jane, and retrieve her post:

``` shell
$ cd clutter
$ perl ../benchmark.pl
...
Total chain: 17.32K
Total DHT: 701.389K
Total Bytes Sent: 6349.02K
Total Gossip Sent: 3379.842K
Total CPU: 19510ms
```

### Sorting

Sorting data is a very common computational task. In this scenario we examine a few cases of list sorting and show the gas costs of sorting lists, with similar computation in Holochain.

#### Result
- _Ethereum:_ In [this repo](https://github.com/alice-si/array-booster) Jakub Wojciechowski has created a test suite for two different sorting algorithms which reports gas costs.  We have added a test to also show the maximum size of an array to be sorted before the gas cost is greater than the maximum gas cost per block, making it effectively impossible to compute.

``` shell
$ cd sorting/ethsort
$ truffle develop
test

...

  Contract: Soriting algorithms
    Insertion Sort algorithm:
Gas [10 elements]: 94406
      ✓ should sort 10 elements with insertion Sort (245ms)
Gas [25 elements]: 224466
      ✓ should sort 25 elements with insertion Sort (668ms)
Gas [50 elements]: 543642
      ✓ should sort 50 elements with insertion Sort (1569ms)
Gas [100 elements]: 1389870
      ✓ should sort 100 elements with insertion Sort (4082ms)
Gas [200 elements]: 4211830
      ✓ should sort 200 elements with insertion Sort (13348ms)
    Quick Sort algorithm:
Gas [10 elements]: 95192
      ✓ should sort 10 elements with Quick Sort (4417ms)
Gas [25 elements]: 224142
      ✓ should sort 25 elements with insertion Sort (557ms)
Gas [50 elements]: 440070
      ✓ should sort 50 elements with insertion Sort (1268ms)
Gas [100 elements]: 843663
      ✓ should sort 100 elements with insertion Sort (2264ms)
Gas [200 elements]: 1788194
      ✓ should sort 200 elements with insertion Sort (5020ms)

```

- _Holochain:_ For this scenario we create a holochain app which provides a function that takes a list and then creates an entry of that list sorted, which gets puts to the DHT and then read back by 10 other nodes.   This is not quite the same scenario as above because it includes reading, but that's reasonable because reading, though less expensive in the Holocain world than write, doesn't come without some cost.

Here are the results from a run with the list size to sort set to 200 to match the Ethereum scenarios above.

``` shell
$ cd sorting
$ ../perl benchmark.pl
...
Total chain: 1.6K
Total DHT: 241.42K
Total Bytes Sent: 655.94K
Total Gossip Sent: 121.89K
Total CPU: 4840ms

```

Here are the results from a run with the list size to sort set to 20000, which simply cannot be done in the case of Ethereum because it costs more gas than the max block gas limit.

``` shell
Total chain: 96.145K
Total DHT: 1777.201K
Total Bytes Sent: 2182.001K
Total Gossip Sent: 132.369K
Total CPU: 9679ms

```
