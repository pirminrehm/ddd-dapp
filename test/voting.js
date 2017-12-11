const Voting = artifacts.require("./Voting.sol");
Web3 = require("web3");
const web3 = new Web3();
const data = require('./data.json');

nr = (num) => Number(num.toString(10));

contract('Voting', (accounts) => {

  let contract;
  beforeEach((done) => {
    Voting.deployed().then(instance => {
      contract = instance;
      done();
    });
  });

  describe('Unit Tests', () => {
    it("should not have inital any voting users", async () => {
      const count = await contract.getVotingUsersCount.call();
      assert.strictEqual(nr(count), 0, "VotingUsers count is not 0");
    });
  
    it("should not have inital any voted locations", async () => {
      const count = await contract.getVotedLocationsCount.call();
      assert.strictEqual(nr(count), 0, "VotedLocations count is not 0");
    });
  
    it("should add a new voting of 50 points for location_1 from acc_0", async () => {
      const res = await contract.addVote(data.uri1, 50 ,{from: accounts[0]});
      assert.isString(res.tx,"no transaction hash was returned");
      assert.isNumber(res.receipt.gasUsed, "used gas is not specified");
      assert.isString(res.receipt.blockHash,"blockHash is not specified");
      assert.isNumber(res.receipt.blockNumber, "blockNumber is not specified");
    });
  
    it("should now have exacly one voting users", async () => {
      const count = await contract.getVotingUsersCount.call();
      assert.strictEqual(nr(count), 1, "VotingUsers count is not 1");
    });
  
    it("should now have exacly one voted location", async () => {
      const count = await contract.getVotedLocationsCount.call();
      assert.strictEqual(nr(count), 1, "VotedLocations count is not 1");
    });
  
    it("should be possible to get location_1 points by uri", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri1);
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(nr(res[1]), 50, "location points are wrong");
    });
  
    it("should be possible to get location_1 points by index ", async () => {
      const res = await contract.getLocationPointsByIndex.call(0);
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(nr(res[1]), 50, "location points are wrong");
    });
  
    it.skip("should not be possilbe to add negative points", function() {});
    it.skip("should not be possilbe to add more than 100 points in one vote", function() {});
    it.skip("should not be possilbe to exceed 100 points per user", function() {});
  
    it.skip("should be possible to get the name of the vote", function() {});
  })

  describe('Story 1', () => {
    it("should be possible to add votes for location_1 from different accounts", async () => {
      const newContract = await Voting.new();
      
      await newContract.addVote(data.uri1, 50, {from: accounts[0]});
      await newContract.addVote(data.uri1, 50, {from: accounts[1]});
      await newContract.addVote(data.uri1, 50, {from: accounts[2]});
      await newContract.addVote(data.uri1, 50, {from: accounts[3]});
      await newContract.addVote(data.uri1, 50, {from: accounts[4]});

      const res = await newContract.getLocationPointsByURI.call(data.uri1);
      assert.equal(web3.toUtf8(res[0]), data.uri1, "location uri is wrong");
      assert.equal(nr(res[1]), 250, "location points are wrong");
    });
  });

  describe('Story 2', () => {
    it.skip("should be possible to add votes for different locations from one account", () => {});
  });
});