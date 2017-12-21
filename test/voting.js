const Voting = artifacts.require("./Voting.sol");
Web3 = require("web3");
const web3 = new Web3();
const expect = require('chai').expect;
const data = require('./data.json');


let nr = num => Number(num.toString(10));
let f8 = str => web3.fromUtf8(str);
let t8 = str => web3.toUtf8(str);

contract('Voting', accounts => {
  let contract;

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

    it('should not be possible to close the voting twice');
    it('should not be possible to vote in a closed voting');
    
  });


  describe('Story 1: Add Votes from different Accounts', () => {
    before(done => {
      Voting.new(f8('story_1_voting'))
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
    let winningLocation;

    before(done => {
      Voting.new(f8('story_2_voting'))
      .then(instance => {
        contract = instance;
        done();
      });
    });

    it("should add many votes different accounts", async () => {
      await contract.addVote(data.uri1, 10, {from: accounts[0]});
      await contract.addVote(data.uri2, 10, {from: accounts[0]});
      await contract.addVote(data.uri3, 5, {from: accounts[0]});
      await contract.addVote(data.uri4, 5, {from: accounts[0]});
      await contract.addVote(data.uri5, 70, {from: accounts[0]});

      await contract.addVote(data.uri1, 1, {from: accounts[1]});
      await contract.addVote(data.uri2, 3, {from: accounts[1]});
      await contract.addVote(data.uri3, 1, {from: accounts[1]});
      await contract.addVote(data.uri4, 5, {from: accounts[1]});
      await contract.addVote(data.uri5, 90, {from: accounts[1]});

      await contract.addVote(data.uri1, 100, {from: accounts[2]});
      // await contract.addVote(data.uri2, 0, {from: accounts[2]});
      // await contract.addVote(data.uri3, 0, {from: accounts[2]});
      // await contract.addVote(data.uri4, 0, {from: accounts[2]});
      // await contract.addVote(data.uri5, 0, {from: accounts[2]});

      await contract.addVote(data.uri1, 3, {from: accounts[3]});
      await contract.addVote(data.uri2, 90, {from: accounts[3]});
      await contract.addVote(data.uri3, 2, {from: accounts[3]});
      await contract.addVote(data.uri4, 5, {from: accounts[3]});
      // await contract.addVote(data.uri5, 0, {from: accounts[3]});
    });

    it("should check account_0 points by address", async () => {
      const res = await contract.getUserPointsByAddress.call(accounts[0]);
      expect(res[0]).to.equal(accounts[0]);
      expect(nr(res[1])).to.equal(100);
    });

    it("should check account_1 points by address", async () => {
      const res = await contract.getUserPointsByAddress.call(accounts[1]);
      expect(res[0]).to.equal(accounts[1]);
      expect(nr(res[1])).to.equal(100);
    });

    it("should check account_2 points by address", async () => {
      const res = await contract.getUserPointsByAddress.call(accounts[2]);
      expect(res[0]).to.equal(accounts[2]);
      expect(nr(res[1])).to.equal(100);
    });

    it("should check account_3 points by address", async () => {
      const res = await contract.getUserPointsByAddress.call(accounts[3]);
      expect(res[0]).to.equal(accounts[3]);
      expect(nr(res[1])).to.equal(100);
    });


    it("should check location_1 points by uri", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri1);
      expect(t8(res[0])).to.equal(data.uri1);
      expect(nr(res[1])).to.equal(114);
    });

    it("should check location_2 points by uri", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri2);
      expect(t8(res[0])).to.equal(data.uri2);
      expect(nr(res[1])).to.equal(103);
    });

    it("should check location_3 points by uri", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri3);
      expect(t8(res[0])).to.equal(data.uri3);
      expect(nr(res[1])).to.equal(8);
    });

    it("should check location_4 points by uri", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri4);
      expect(t8(res[0])).to.equal(data.uri4);
      expect(nr(res[1])).to.equal(15);
    });

    it("should check location_5 points by uri", async () => {
      const res = await contract.getLocationPointsByURI.call(data.uri5);
      expect(t8(res[0])).to.equal(data.uri5);
      expect(nr(res[1])).to.equal(160);
    });

    it("should close the voting and determine the winner", done => {
      let noLogWasRecieved = true;
      contract.VotingClosed().watch((error, log) => {
        if(noLogWasRecieved) {
          noLogWasRecieved = false;
          expect(log).to.be.an('object');
          expect(log.event).to.equal('VotingClosed');        
          expect(log.args).to.be.an('object');
          expect(log.args.winningLocation).to.be.a('string');
          winningLocation = t8(log.args.winningLocation);
          let random = nr(log.args.random);
          let sumOfAllPoints = nr(log.args.sumOfAllPoints);
          console.log('******* Location Points: ');
          console.log('******* - mcd:  114');
          console.log('******* - asia: 103');
          console.log('******* - bc:   8');
          console.log('******* - kfc:  15');
          console.log('******* - sbw:  160');
          console.log('******* Winning Location: ' + winningLocation);
          console.log('******* Random:           ' + random);
          console.log('******* SumOfAllPoints:   ' + sumOfAllPoints);
          contract.VotingClosed().stopWatching();
          done();
        }
      });

      contract.closeVotingStochastic({from: accounts[0]}).then(res=> {
        expect(res).not.to.be.null;
      });
    }).timeout(1000);

    it("should get the winningLocation by getter", async () => {
      const res = await contract.getWinningLocation.call();
      expect(t8(res)).to.equal(winningLocation);
    });
  });
});