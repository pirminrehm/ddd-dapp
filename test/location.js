var Location = artifacts.require("./Location.sol");
Web3 = require("web3");
var web3 = new Web3();

var data = require('./data.json');



contract('Location', function(accounts) {
  it("should not have inital any locations", function() {
    return Location.deployed().then(function(instance) {
      return instance.getLocationCount.call();
    }).then(function(count) {
      assert.strictEqual(Number(count.toString(10)), 0, "Location count is not 0");
    });
  });
  it("should add a new location (location_1)", function() {
    return Location.deployed().then(function(instance) {
      return instance.addLocation(data.uri1, data.location1, {from: accounts[0]});
    }).then(function(res) {
      assert.isString(res.tx,"no transaction hash was returned");
      assert.isNumber(res.receipt.gasUsed, "used gas is not specified");
      assert.isString(res.receipt.blockHash,"blockHash is not specified");
      assert.isNumber(res.receipt.blockNumber, "blockNumber is not specified");
    });
  });
  it("should now have exacly one location", function() {
    return Location.deployed().then(function(instance) {
      return instance.getLocationCount.call();
    }).then(function(count) {
      assert.strictEqual(Number(count.toString(10)), 1, "Location count is not 1");
    });
  });
  it("should be possible to get location_1 by index", function() {
    return Location.deployed().then(function(instance) {
      return instance.getLocationAtIndex.call(0);
    }).then(function(res) {
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(web3.toUtf8(res[1]), data.location1, "location name is wrong");
    });
  });
  it.skip("TODO: should be possible to get location_1 by index (refactored)", function() {
    return Location.deployed().then(function(instance) {
      return instance.getLocationByIndex.call(0);
    }).then(function(res) {
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(web3.toUtf8(res[1]), data.location1, "location name is wrong");
    });
  });
  it("should be possible to get  location_1 by URI", function() {
    return Location.deployed().then(function(instance) {
      return instance.getLocationByURI.call(web3.fromUtf8(data.uri1));
    }).then(function(res) {
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(web3.toUtf8(res[1]), data.location1, "location name is wrong");
    });
  });
  it("should not be possible to add location_1 URI again", function() {
    return Location.deployed().then(function(instance) {
      return instance.addLocation(data.uri1, data.location1);
    }).catch(function(err) {
      assert.typeOf(err,'error', "No error was thrown");
    });
  });
  it("add a new location (location_2)", function() {
    return Location.deployed().then(function(instance) {
      return instance.addLocation(data.uri2, data.location2, {from: accounts[0]});
    }).then(function(res) {
      assert.isString(res.tx,"no transaction hash was returned");
      assert.isNumber(res.receipt.gasUsed, "used gas is not specified");
      assert.isString(res.receipt.blockHash,"blockHash is not specified");
      assert.isNumber(res.receipt.blockNumber, "blockNumber is not specified");
    });
  });
  it("should now have exacly two locations", function() {
    return Location.deployed().then(function(instance) {
      return instance.getLocationCount.call();
    }).then(function(count) {
      assert.strictEqual(Number(count.toString(10)), 2, "Location count is not 2");
    });
  });
  it("should be possible to get location_2 by URI", function() {
    return Location.deployed().then(function(instance) {
      return instance.getLocationByURI.call(web3.fromUtf8(data.uri2));
    }).then(function(res) {
      assert.equal(web3.toUtf8(res[0]), data.uri2, "location uri is wrong");
      assert.equal(web3.toUtf8(res[1]), data.location2, "location name is wrong");
    });
  });
});