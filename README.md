# benchmarks

This repo contains a set of benchmarks that measure the cost in gas for set of Ethereum smart contracts, and the cpu/bandwith/storage usage of Holochain applications that accomplish the same tasks.

The purpose of these comparisons is to establish an initial "holochain compute unit (HCU)" that consists of a specific amount of CPU, bandwidth and storage usage, that we can use to establish the initial value of 1 HOLO, the mutual credit currency that will be used by hosters on the Holo platform to charge for hosting.  At launch time, we will provide 1 such unit of computing for 1 HOLO.  We expect others to undercut our price.

Because the architectures of Blockchain/Ethereum are so different we acknowledge right here at the top, and these comparisons are not apples-to-apples.

## Pricing Mechanics and Evolution
### hosters set their own prices
### displaying average prices
### charging per application by it's usage profile

## Issues that make comparison tricky

### On-chain storage costs
### Cost differences between CPU/Storage/Bandwith/Memory

## Methodology

1) _Scenarios_:  We have created scenarios of usage of the Smart Contract/Holochain Application, for example for the DAO application the scenario consists of an owner setting up a fixed number of members of the DAO, the members then create and voting on proposal and finalize them.

2) Measuring costs of gas for ETH Smart Contracts:  We use the truffle test environment and sum up the costs of gas of all the transactions involved in the scenarios.  We report these values as the cost.

3) Measuring computing usage of Holochain Applications:  We have added in benchmarking code directly into Holochain core that is activated by the scenario system of our Test Driven Development framework.  This code measures:
 - storage by the number of bytes used in agents' source chains and stored in their DHT databases
 - bandwith by counting the number of bytes sent by all agents.
 - cpu usage as measured by the https://github.com/shirou/gopsutil library on a quad-core Thinkpad P51s laptop running ubuntu 16.04

## Benchmark Scenarios

### ICO Whitelist
### DAO
