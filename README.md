# Holo Value Benchmarks

### Summary:
This repo contains benchmarks for comparing the *price* of computation in Ethereum vs. Holochain. For each benchmark we have some functionality coded as an Ethereum smart contract and parallel functionality coded as an app that accomplishes the same task on Holochain, an alternative distributed computing framework.

In the case of Ethereum, we can easily identify how much gas it takes to accomplish the tasks and then look to [Etherscan](https://etherscan.io/chart/gasprice) for data about the average daily gas price for all the days in January, and to [Ethereum Gas Station](https://ethgasstation.info/) for how long it would take to run.

In the case of a Holochain app, we use our scenario testing framework to run many simultaneous nodes emulating the interactions of a decentralized network of peers running it (since there's not a real network of people running benchmarks). We can measure how much work each node has to do as measured in milliseconds of CPU usage, bandwidth, storage as well as the gossip activity between nodes for synchronization.

### Context:
Once Holo launches and nodes are providing hosting services, they set their own prices, so the market will determine how much hosting power a unit of Holo fuel buys. However, in advance of that time for the Initial Community Offering of the currency, we need to set some kind of starting point for the pre-sale of the currency. And we can guarantee that at least we will offer hosting at that price. Even at 1/10,000 the price of running the computation on Ethereum, the price is high enough that anyone would happily offer hosting on Holochain at that price.

We see the market for hosting resilient applications as a spectrum spread across a few dimensions.

#### **Centralization:**
  - *Single server* hosting is completely centralized (and not particularly resilient).
  - *Cloud hosting* is less centralized and more resilient, in that the cloud provider may be spreading parts of your load across different servers and possibly different data centers, but is still typically centralized to a single live data source, and proprietary gossip and coordination inside their private network.
  - *Ethereum smart contracts* run on a network of approximately 26,000 mining nodes all updating the shared state of a global blockchain ledger.
  - *Holochain* apps are fully distributed / peer to peer and comprise an ecosystem of networks validating a sharded DHT. If you have 330 million users of an Twitter-like app, they each run a copy and the data is sharded across them all with a set redundancy factor.

#### **Architectural Efficiency:**
  - **Blockchain / Ethereum dApps** have thousands of nodes that need to maintain the same state, and every node must perform the same processing. This is the ***least efficient form of distributed computing*** forcing every node to do the redundant work of all the other nodes, and limiting throughput to the slowest computer of the lot. Not only is there large communications overhead to pass all messages between all the nodes and have every node validate the work done in each block, but to compound this inefficiency, blockchains that use proof-of-work add massive additional computational overhead to randomize which node will be the authority to commit the next block of state changes.
  - **Single Sever / Cloud hosting** require every person who wants to interact with an application to compete for the computing power of one single server which is the bottleneck for all computation, interactions, and data updates. For low traffic, or static content, this isn't so bad, but large volumes of dynamic or interactive content quickly overload the capacities of a single server.
  - **CDN / Load Balanced / Replicated hosting** address the bottleneck of centralized hosting by pushing static content out to various places on the network so the requests don't even need to converge to the single server and get get cached and served by a content delivery network. For the dynamic content that can't be statically cached, various strategies are employed to increase the computing power available to service the traffic. This is sometimes done through load balancing, clustering, or even having a replicated database across multiple clusters of servers spread around the Internet. At this point there are pretty reliable tools for this behavior, but management of large scale dynamic operations like Facebook or Google require an army of devops staff to set up and maintain this complex infrastructure.
  - **Holo / Virtual Distributed Hosting** leverages the self-scaling architecture of Holochain (see next section) by providing a hybrid peering/hosting framework. To make holochain applications accessible via a web browser to people who are not running holochain, Holo hosts extend virtual holochain services to people not running holochain. This provides similar clustering/replicating functions as described above, but with the simpler to run and maintain peer-to-peer geometry of Holochain applications with sharded DHTs.
  - **Holochain / Fully Peered Hosting** provides a fully peer-to-peer scalable computing framework where each user performs their own computing on their own device and publishes any changes to an asynchronous validating DHT (distributed hash table) which functions as a shared ledger. This architecture eliminates all processing bottlenecks and can even be implemented with DHT caching to eliminate hot spots, and provide CDN-like performance optimization. This approach has the added benefit of each person always being able to keep a local copy of all the data they've created.

#### **Price:**
  - **Ethereum** is so ridiculously expensive that it should hardly be considered a computing platform. It's like having a car that is too expensive to ever drive: \$83 dollars to sort a list of 200 items, \$10,000 to store a whitelist of 10k addresses for an ICO ($1 per address). It's probably best to stick to "HODLing" your ETH, because it's a waste to try to do any computing with it. Running code and storing data on this "global computer" currently costs 100,000,000x to 1,000,000,000x the cost of doing the same computing on Amazon Web Services (Yes, that is up to 1 billion times more expensive.).
  - **Sidechains** attempt to provide a cheaper, smaller, private, but connected framework for computing or storage which can return results to the main Ethereum chain. Basically, this forces the complexity of computing integration across chains to developers because of the fundamental unscalability of the blockchain architecture. It creates more points of failure, and typically involves developing across multiple languages, platforms, and testing frameworks. It's kind of an invitation for a big tangled mess. What could go wrong?
  - **Holo.host** provides a bridge from the large scale P2P holochain architecture, to people not running holochain, who just want to access dApps as if they are a centralized web site. For our ICO we are starting the pricing for this at 1/10,000 the cost of Ethereum, but our benchmarks indicate that this is quite comfortably conservative and we can expect to see hosts drop their prices much lower to attract income, probably even another 10,000 times cheaper still. This starts to put Holo hosting in a similar price range to be able to compete with cloud hosting.
  - **Cloud hosting** has been the sweet spot in the price/performance spectrum for a while by having a big company use their army of devops people do the clustering and load balancing for you. This is a pretty appealing option to small companies who want the option to increase their scale when needed, but don't have their own technical staff to build a scalable architecture. But remember, as described in the Architectural Efficiency section above, this is basically about putting a band-aid on a centralized architecture. It can scale beyond a single computer to clusters and cached static content, but if you need to scale across data centers or across the world, this happens at a much higher price point involving custom scaling solutions.
  - **That spare computer in your basement** will probably be slow and unreliable for serving up information and if it fails (as old computers eventually do) you're likely to suffer data loss (unless you're way better about backups than most people). This is certainly a cheap option and basically one of the cases where you get what you pay for.
  - **Holochain** uses computing power of various devices and knits it into reliable and resilient peer-to-peer fabric with cryptographically-assured data integrity. It is efficient enough to operate without needing to pay any mining or hosting fees. Each device carries its own part of the load, plus a small multiplier for ensuring shared resilience and redundancy for the application data.

### Benchmarking Purpose:
We have to set an initial price for the sale of Holo fuel for our ICO. Holo fuel will be used to buy hosting services from Holo hosts. Those hosts charge for the computing power they provide by billing for CPU, bandwidth, and storage they provide.  In some senses, the price we charge for Holo fuel can be arbitrary because hosts can set their own prices (in Holo fuel) for the computing they provide, however, to jump start the network, Holo will also be providing hosting at a particular pre-declared price.  We have to set a price that:
1. Provides ample value compared to other blockchain dApps so people will want to participate in the ICO,
2. Can guarantee hosting services at that price because it is high enough for pretty much anyone to be happy to charge at that rate,
3. Will be undercut quickly by hosts competing for traffic and thus provide an early rise in value of the currency which should stabilize at the hosting becomes commodified.

Because Ethereum provides distributed computing at a cost that people are actually paying now, it seems reasonable to believe that if we can undercut that price by a wide margin (10,000 time cheaper) that's ample incentive for people to participate in an ICO.  These benchmarks indicate show that margin to be ample as a starting price, while giving room for rapid price improvement which increases the value of the currency early in its life.

**Thus, we somewhat arbitrarily declare that we will set the price of 10,000 Holo fuel at 1 Euro, and that for that 1 Euro's worth of Holo fuel, you will get as much computing as 10,000 Euros would buy you on Ethereum as demonstrated by the benchmarking tests below.**  These tests will demonstrate how much CPU, storage and bandwidth Holochain uses to accomplish those tasks, and from that data we set a baseline for how much computing you get for 1 Holo fuel (or 1 HOT as its proxy in the ICO).

## Issues that make comparison tricky

Because the architectures of Blockchain/Ethereum are so different we acknowledge right here at the top, and these comparisons are not apples-to-apples, however they do provide sufficient data to set the initial amount of computing you get for 1 Holo fuel unit.  Here are some of the challenges in making the comparison:

### Gas price fluctuation
Over the time in which we built out these benchmarks we have seen standard [gas prices](https://ethgasstation.info/index.php) fluctuate between 4-90 Gwei.  For the purposes of choosing our standard compute unit, we averaged the gas prices for the all the days of Jan 2018 before the launch of our ICO.

### Read vs. Write
For both Ethereum and Holo, there is a difference in real world costs for read vs. write.  In the case of  Ethereum all of the cost paid by participants has been shifted to write, i.e. to changing state, and all read transactions are free.  This is despite the fact that there are real costs in the world for read operations on the Ethereum, it's just that the community treats them as overhead.

For Holo both read & write transactions will carry a cost, though read transactions will be significantly cheaper because they don't trigger as much activity on the network.  For Holochain there are also 'uncharged' costs that the community will have to bear as overhead. The mostly relate to the gossip that nodes need to perform to maintain the sharding replication for resilience.

### Cost differences between CPU/Storage/Bandwidth/Memory
We recognize that different hosts have different costs associated with the different aspects of providing computing, and that therefore they will want to set pricing differentially according to the different profiles of the applications.  From our benchmarks below you can see that some applications are storage heavy, others are bandwidth heavy, and others are CPU intensive.  For the purposes of this benchmark we simply lump all of this together to find a starting compute value, that we expect will be very easy for hosts to undercut.

### Gossip & Resilience
A significant portion of the computing overhead in Holochain is attributable to gossip which establishes and maintains the sharded copies of all the application data.  Factoring in this cost into the Holo fuel pricing is very difficult ahead of real-world use cases.  In our benchmarking we have recorded how much of the bandwidth use was due to gossip and simply lumped it into the total.  When Holo launches these overhead costs may be separated out to be accounted for using other methods for more precise value accounting.

## Pricing Mechanics and Evolution
### hosts set their own prices
### displaying average prices
### charging per application by it's usage profile



## Comparison Methodology

1) _Scenarios_:  We have created scenarios of usage of the Smart Contract/Holochain Application, for example for the DAO application the scenario consists of an owner setting up a fixed number of members of the DAO, the members then create and voting on proposal and finalize them.

2) Measuring costs of gas for ETH Smart Contracts:  We use the truffle test environment and sum up the costs of gas of all the transactions involved in the scenarios.  We report these values as the cost.

3) Measuring computing usage of Holochain Applications:  We have added in benchmarking code directly into Holochain core that is activated by the scenario system of our Test Driven Development framework.  This code measures:
 - Storage by the number of bytes used in agents' source chains and stored in their DHT databases
 - Bandwidth by counting the number of bytes sent by all agents.
 - CPU usage as measured by the https://github.com/shirou/gopsutil library on a quad-core Thinkpad P51s laptop running Ubuntu 16.04

## Benchmark Scenarios

### ICO Whitelist
A common use-case for Ethereum is an ICO.  Current banking regulations require that organizations know about their customers before accepting funds from them.  In the world of pseudo-anonymous cryptocurrency this regulation can be honored by creating a white-list process where customers verify their identity and provide a wallet from which they will be sending funds.  This wallet is then stored on the blockchain in a white-list, and tested by the a smart-contract in allowing the minting of coins in the ICO.

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

- _Holochain:_ In this scenario a writer node creating an array of 10K entries and 10 reader nodes that wait 5 seconds for gossip propagation and then read the list.

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

In this scenario for both the Ethereum and Holochain contexts we assume the same number of agents, an owner, 4 members of party A, 3 members of party B, and a proposal implementer (the agent who gets paid).  In the scenario the owner first creates all the members.  Then all the members of party A create a proposal fund it, and vote in favor of it, while all members of party B vote against the proposal.  Because there are more members of party A the proposals will pass when the implementer executes the proposal, and gets funds from it.

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
For proposals with 1k in the proposal text:
``` shell
$ truffle test
...

Total Gas Used:9109388
      ✓ should run the benchmarks (6568ms)
```

- _Holochain:_  In this scenario the test runs for a total of 20 seconds real time.

For proposals with 10 bytes in the proposal text:
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

For proposals with 1k in the proposal text:
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

- _Ethereum:_ The  [leeroy](https://leeroy.io) twitter clone is fully operational and people are joining it and making posts which have significant real-world costs.  We don't have the solidity code available for direct inspection and create an identical scenario in truffle, as we did above.  However zippy joined the network and made a post.  Here is the [transaction hash](https://etherscan.io/tx/0x4ee9b970dabcbb469bfacae71354e7d161b8a9c8787b725d9ded3232c897b110) of the registerUsername call when zippy became a user.  This call used 70726 gas with "Actual Tx Cost/Fee" at 26gwei of 0.001838876 Ether ($1.85) on the day it was made.  And here is the [transaction hash](https://etherscan.io/tx/0x0803f139fb73f5a0cfbfdf102d29ffd9464bb05ee752de41a676db531ca1889d) for zippy's first post.  It used 25721 gas "Actual Tx Cost/Fee" at 3 Gwei of 0.00077163 Ether ($0.78).

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

  Contract: Sorting algorithms
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

- _Holochain:_ For this scenario we create a Holochain app which provides a function that takes a list and then creates an entry of that list sorted, which gets put to the DHT and then read back by 10 other nodes.   This is not quite the same scenario as above because it includes reading, but that's reasonable because reading, though less expensive in the Holochain world than write, doesn't come without some cost.

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

## Conclusions

We are promising that Holo apps will be able to compute for 1/10,000 the cost of doing so on Ethereum. The benchmarks show this to be an easy target such that expect independent market pricing to end up closer to 1/100k or even 1/1m the cost of Ethereum. Holo hosts will still make a good return on their hardware investment even at those rates.

### TL;DR;
- 1 Euro buys you 10,000 Holo Tokens.
- 1 Holo Token buys you 1 Euro's worth of Ethereum computing on Holo.
- This price is high enough for hosts to charge less which should create early value increase in the currency and then stable value once a price equilibrium is reached.
