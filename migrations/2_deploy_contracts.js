var Location = artifacts.require("./Location.sol");
var Voting = artifacts.require("./Voting.sol");
var Team = artifacts.require("./Team.sol");

var Web3 = require("web3");

var web3 = new Web3();



module.exports = function(deployer) {
  // Deploy default contracts so that we can use contract.deployed()
  deployer.deploy(Team)
    .then(() => deployer.deploy(Location, Team.address))
    .then(() => deployer.deploy(
      Voting, 
      web3.fromUtf8('auto_deployed_voting'), 
      Location.address
    ));
};
