var Location = artifacts.require("./Location.sol");
var Voting = artifacts.require("./Voting.sol");
var Team = artifacts.require("./Team.sol");
var Logging = artifacts.require("./Logging.sol");

var Web3 = require("web3");

var web3 = new Web3();



module.exports = function(deployer) {
  deployer.deploy(Logging).then(() => {
    console.log('***************** ' + Logging.address + ' *****************');
  });
};
