var Voting = artifacts.require("./Voting.sol");
Web3 = require("web3");
var web3 = new Web3();

var data = require('./data.json');

function nr(num) {
  return Number(num.toString(10));
}


contract('Voting: Unit Tests', function(accounts) {
  it("should not have inital any voting users", function() {
    return Voting.deployed().then(function(instance) {
      return instance.getVotingUsersCount.call();
    }).then(function(count) {
      assert.strictEqual(nr(count), 0, "VotingUsers count is not 0");
    });
  });
  it("should not have inital any voted locations", function() {
    return Voting.deployed().then(function(instance) {
      return instance.getVotedLocationsCount.call();
    }).then(function(count) {
      assert.strictEqual(nr(count), 0, "VotedLocations count is not 0");
    });
  });
  it("should add a new voting of 50 points for location_1 from acc_0", function() {
    return Voting.deployed().then(function(instance) {
      return instance.addVote(data.uri1, 50 ,{from: accounts[0]});
    }).then(function(res) {
      assert.isString(res.tx,"no transaction hash was returned");
      assert.isNumber(res.receipt.gasUsed, "used gas is not specified");
      assert.isString(res.receipt.blockHash,"blockHash is not specified");
      assert.isNumber(res.receipt.blockNumber, "blockNumber is not specified");
    });
  });
  it("should now have exacly one voting users", function() {
    return Voting.deployed().then(function(instance) {
      return instance.getVotingUsersCount.call();
    }).then(function(count) {
      assert.strictEqual(nr(count), 1, "VotingUsers count is not 1");
    });
  });
  it("should now have exacly one voted location", function() {
    return Voting.deployed().then(function(instance) {
      return instance.getVotedLocationsCount.call();
    }).then(function(count) {
      assert.strictEqual(nr(count), 1, "VotedLocations count is not 1");
    });
  });
  it("should be possible to get location_1 points by uri", function() {
    return Voting.deployed().then(function(instance) {
      return instance.getLocationPointsByURI.call(data.uri1);
    }).then(function(res) {
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(nr(res[1]), 50, "location points are wrong");
    });
  });
  it("should be possible to get location_1 points by index ", function() {
    return Voting.deployed().then(function(instance) {
      return instance.getLocationPointsByIndex.call(0);
    }).then(function(res) {
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(nr(res[1]), 50, "location points are wrong");
    });
  });

  it.skip("should not be possilbe to add negative points", function() {});
  it.skip("should not be possilbe to add more than 100 points in one vote", function() {});
  it.skip("should not be possilbe to exceed 100 points per user", function() {});

  it.skip("should be possible to get the name of the vote", function() {});

});



contract('Voting: Story 1', function(accounts) {
  it("should be possible to add votes for location_1 from different accounts", function() {
    var meta;
    return Voting.deployed().then(function(instance) {
      meta = instance;
      return meta.addVote(data.uri1, 50 ,{from: accounts[0]});
    }).then(function(res) {
      return meta.addVote(data.uri1, 50 ,{from: accounts[1]});
    }).then(function(res) {
      return meta.addVote(data.uri1, 50 ,{from: accounts[2]});
    }).then(function(res) {
      return meta.addVote(data.uri1, 50 ,{from: accounts[3]});
    }).then(function(res) {
      return meta.addVote(data.uri1, 50 ,{from: accounts[4]});
    }).then(function(res) {
      return meta.getLocationPointsByURI.call(data.uri1);
    }).then(function(res) {
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(nr(res[1]), 250, "location points are wrong");
    });
  });
});


contract('Voting: Story 2', function(accounts) {
  it.skip("should be possible to add votes for different locations from one account", function() {});
});