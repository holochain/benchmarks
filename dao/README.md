# HoloDAO

[![Code Status](https://img.shields.io/badge/Code-Pre--Alpha-orange.svg)](https://github.com/Holochain/dao)
[![In Progress](https://img.shields.io/waffle/label/Holochain/dao/in%20progress.svg)](http://waffle.io/Holochain/dao)
[![Gitter](https://badges.gitter.im/metacurrency/holochain.svg)](https://gitter.im/metacurrency/holochain?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

**A Holochain implementation of the Ethereum example DAO contract**
As part of our benchmarking for [Holo](http://holo.host) we have built a Holochain version of the sample [DAO contract](https://github.com/Holochain/dao/blob/master/dao.sol) from the Ethereum.org website.  Comparing Holochain apps to Ethereum smart contracts is a bit like comparing apples and pineapples.  Though they are both distributed computing platforms, because of their different starting assumptions, the results are quite difficult to compare.  For example, Ethereum comes with a built in transactional layer, which Holochain does not.  So in this app we hand-coded a mutual-credit transaction zome to emulate that functionality.

**[Code Status:](https://github.com/metacurrency/holochain/milestones?direction=asc&sort=completeness&state=all)** Pre-alpha. Not for production use. This application has not been audited for any security validation.

## Installation

Prerequiste: [Install holochain](https://github.com/metacurrency/holochain/#installation) on your machine.
You can install HoloDAO very simply with this:

``` shell
hcdev init -cloneExample=dao

```

## Usage

This example has no UI, it's only useful to run from tests.

### Tests
To run all the stand alone tests:

``` shell
hcdev test
```

Currently there is one scenario test:

#### benchmark
This scenario spins up an owner node, an implementer node and a bunch of member nodes which create and vote on a bunch of proposals.  Finally at the end the implementer executes the proposals.

``` shell
hcdev -mdns=true -no-nat-upnp scenario -benchmarks benchmark

```
This will output the detailed benchmark tests including the benchmark data for each node.  To see the aggregate benchmark data you can pass the output through the `bench.pl` script like this:

``` shell
hcdev -mdns=true -no-nat-upnp scenario -benchmarks benchmark | perl bench.pl

```
Which should result in some output something like:
```
Total chain: 45.22
Total DHT: 1287.27
Total Bytes Sent: 7394.64
Total CPU: 20840
```

This repo contains a dao ethereum scenario built as a truffle test to calculate how much gas is used to do a similar amount of computation.  To install and run this scenario:

``` shell
npm install -g truffle
cd ethdao
npm install
truffle develop
```
Then from the truffle command line:
```
migrate
test
```
This should produce output that ends with the line something like:

``` shell
Total Gas Used:6224448
```

## Contribute
We welcome pull requests and issue tickets.  Find us on [gitter](https://gitter.im/metacurrency/holochain) to chat.

Contributors to this project are expected to follow our [development protocols & practices](https://github.com/metacurrency/holochain/wiki/Development-Protocols).

## License
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)

Copyright (C) 2017, The MetaCurrency Project (Eric Harris-Braun, Arthur Brock, et. al.)

This program is free software: you can redistribute it and/or modify it under the terms of the license provided in the LICENSE file (GPLv3).  This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

**Note:** We are considering other 'looser' licensing options (like MIT license) but at this stage are using GPL while we're getting the matter sorted out.
