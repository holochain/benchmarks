var InsertionSorter          = artifacts.require("./InsertionSorter.sol");
var QuickSorter              = artifacts.require("./QuickSorter.sol");

module.exports = function(deployer) {
  deployer.deploy(InsertionSorter);
  deployer.deploy(QuickSorter);
};
