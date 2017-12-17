const Voting = artifacts.require("./Voting.sol");
Web3 = require("web3");
const web3 = new Web3();
const expect = require('chai').expect;
const data = require('./data.json');


let nr = num => Number(num.toString(10));
let f8 = str => web3.fromUtf8(str);
let t8 = str => web3.toUtf8(str);

contract('Voting', (accounts) => {

  let contract;
  // beforeEach((done) => {
  //   Voting.deployed().then(instance => {
  //     contract = instance;
  //     done();
  //   });
  // });

  describe('Init-Tests', () => {
    beforeEach(done => {
      Voting.new(f8('init_test_voting'))
      .then(instance => {
        contract = instance;
        done();
      });
    });

    it("should not have inital any voting users", async () => {
      const count = await contract.getVotingUsersCount.call();
      assert.strictEqual(nr(count), 0, "VotingUsers count is not 0");
    });
  
    it("should not have inital any voted locations", async () => {
      const count = await contract.getVotedLocationsCount.call();
      assert.strictEqual(nr(count), 0, "VotedLocations count is not 0");
    });
    it("should not be possilbe to add negative points", async () => {
      try {
        const res = await contract.addVote(data.uri1, -1 ,{from: accounts[0]});
        expect(res).to.be.null;
      } catch(e) {
        expect(e).to.be.an('error');
      }
    });

    it("should not be possilbe to add more than 100 points in one vote", async () => {
      try {
        const res = await contract.addVote(data.uri1, 101 ,{from: accounts[0]});
        expect(res).to.be.null;
      } catch(e) {
        expect(e).to.be.an('error');
      }
    });

    it("should not be possilbe to exceed 100 points per user", async () => {
      try {
        const res0 = await contract.addVote(data.uri1, 100 ,{from: accounts[0]});
        const res = await contract.addVote(data.uri1, 1 ,{from: accounts[0]});
        expect(res).to.be.null;
      } catch(e) {
        expect(e).to.be.an('error');
      }
    });
  
    it("should get the name of the vote", async () => {
      const votingName = await contract.getVotingName.call();
      expect(t8(votingName)).to.equal('init_test_voting');
    });
  });


  describe('Story 1: Add Votes from different Accounts', () => {
    before(done => {
      Voting.new(f8('story_voting'))
      .then(instance => {
        contract = instance;
        done();
      });
    });

    it("should add a new voting of 50 points for location_1 from acc_0", async () => {
      const res = await contract.addVote(data.uri1, 50 ,{from: accounts[0]});
      expect(res).not.to.be.null;
      expect(res.receipt).to.be.an('object');
      expect(res.receipt.blockNumber).to.be.gt(0);
      expect(res.receipt.gasUsed).to.be.gt(0);
      expect(res.receipt.transactionHash).to.be.a('string');
    });
  
    it("should now have exacly one voting users", async () => {
      const count = await contract.getVotingUsersCount.call();
      expect(nr(count)).to.equal(1);
    });
  
    it("should now have exacly one voted location", async () => {
      const count = await contract.getVotedLocationsCount.call();
      expect(nr(count)).to.equal(1);
      
    });
  
    it("should get location_1 points by uri", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri1);
      expect(t8(res[0])).to.equal(data.uri1);
      expect(nr(res[1])).to.equal(50);
    });
  
    it("should get location_1 points by index ", async () => {
      const res = await contract.getLocationPointsByIndex.call(0);
      expect(t8(res[0])).to.equal(data.uri1);
      expect(nr(res[1])).to.equal(50);
    });

    it("should add votes of 250 points for location_1 from different accounts", async () => {
      var res;
      res = await contract.addVote(data.uri1, 50, {from: accounts[0]});
      expect(res).to.be.an('object');;
      res = await contract.addVote(data.uri1, 50, {from: accounts[1]});
      expect(res).to.be.an('object');;
      res = await contract.addVote(data.uri1, 50, {from: accounts[2]});
      expect(res).to.be.an('object');;
      res = await contract.addVote(data.uri1, 50, {from: accounts[3]});
      expect(res).to.be.an('object');;
      res = await contract.addVote(data.uri1, 50, {from: accounts[4]});
      expect(res).to.be.an('object');;
    });

    it("should get updated location_1 points", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri1);
      expect(t8(res[0])).to.equal(data.uri1);
      expect(nr(res[1])).to.equal(300);
    });
  })

  describe('Story 2: Simulate voting and close voting by 4 users', () => {
    before(done => {
      Voting.new(f8('story_voting'))
      .then(instance => {
        contract = instance;
        done();
      });
    });
  });
});