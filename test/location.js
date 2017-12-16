const Location = artifacts.require("./Location.sol");
Web3 = require("web3");
const web3 = new Web3();
const data = require('./data.json');

nr = (num) => Number(num.toString(10));

contract('Location', (accounts) => {

  let contract;
  beforeEach((done) => {
    Location.deployed()
      .then(instance => contract = instance)
      .then(_ => done());
  });

  it("should not have inital any locations", async () => {
    const count = await contract.getLocationCount.call();
    assert.strictEqual(nr(count), 0, "Location count is not 0");
  });

  it("should add a new location (location_1)", async () => {
    const res = await contract.addLocation(data.uri1, data.location1, {from: accounts[0]});
    assert.isString(res.tx,"no transaction hash was returned");
    assert.isNumber(res.receipt.gasUsed, "used gas is not specified");
    assert.isString(res.receipt.blockHash,"blockHash is not specified");
    assert.isNumber(res.receipt.blockNumber, "blockNumber is not specified");
  });

  it("should now have exacly one location", async () => {
    const count = await contract.getLocationCount.call();
    assert.strictEqual(nr(count), 1, "Location count is not 1");
  });

  it("should be possible to get location_1 by index", async () => {
    const res = await contract.getLocationAtIndex.call(0);
    assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
    assert.equal(web3.toUtf8(res[1]), data.location1, "location name is wrong");
  });

  it.skip("TODO: should be possible to get location_1 by index (refactored)", async () => {
    const res = await contract.getLocationAtIndex.call(0);
    assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
    assert.equal(web3.toUtf8(res[1]), data.location1, "location name is wrong");
  });

  it("should be possible to get location_1 by URI", async () => {
    const res = await contract.getLocationByURI.call(web3.fromUtf8(data.uri1));
    assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
    assert.equal(web3.toUtf8(res[1]), data.location1, "location name is wrong");
  });

  it("should not be possible to add location_1 URI again", async () => {
    try {
      const res = await contract.addLocation(data.uri1, data.location1);
      expect(res).to.be.null;
    } catch(e) {
      assert.typeOf(e, 'error', "No error was thrown");
    }
  });

  it("add a new location (location_2)", async () => {
    const res = await contract.addLocation(data.uri2, data.location2, {from: accounts[0]});
    
    assert.isString(res.tx,"no transaction hash was returned");
    assert.isNumber(res.receipt.gasUsed, "used gas is not specified");
    assert.isString(res.receipt.blockHash,"blockHash is not specified");
    assert.isNumber(res.receipt.blockNumber, "blockNumber is not specified");
  });

  it("should now have exacly two locations", async () => {
    const count = await contract.getLocationCount.call();
    assert.strictEqual(Number(count.toString(10)), 2, "Location count is not 2");
  });

  it("should be possible to get location_2 by URI", async () => {
    const res = await contract.getLocationByURI.call(web3.fromUtf8(data.uri2));
    assert.equal(web3.toUtf8(res[0]), data.uri2, "location uri is wrong");
    assert.equal(web3.toUtf8(res[1]), data.location2, "location name is wrong");
  });
});