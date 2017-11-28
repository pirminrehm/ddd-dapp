var Location = artifacts.require("./Location.sol");
var Voting = artifacts.require("./Voting.sol");



module.exports = function(deployer) {
  deployer.deploy(Location);
  deployer.deploy(Voting);
};
