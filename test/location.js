const Location = artifacts.require('./Location.sol');
const Team = artifacts.require('./Team.sol');

Web3 = require('web3');
const web3 = new Web3();
const expect = require('chai').expect;
const data = require('./data.json');
const testHelper = require('./testHelper')

const nr = (num) => Number(num.toString(10));
const f8 = str => web3.fromUtf8(str);
const t8 = str => web3.toUtf8(str);

contract('Location', (accounts) => {

  describe('Init-Test', () => {
    let contract;
    before(done => {
      testHelper.createTeamWithAllAccounts(accounts)
      .then(teamContract => {
        return Location.new() ///teamContract
      }).then(instance => {
        contract = instance;
        done();
      });     
    });

    it('should not have inital any locations', async () => {
      const count = await contract.getLocationCount.call();
      expect(nr(count)).to.be.equal(0);
    });

    it('should add a new location (location_1)', async () => {
      const res = await contract.addLocation(data.uri1, data.location1, {from: accounts[0]});
      expect(res).not.to.be.null;
      expect(res.receipt).to.be.an('object');
      expect(res.receipt.blockNumber).to.be.gt(0);
      expect(res.receipt.gasUsed).to.be.gt(0);
      expect(res.receipt.transactionHash).to.be.a('string');
    });
  });
  
  describe('Story 1: Add a two locations', () => {
    let contract;
    before(done => {
      testHelper.createTeamWithAllAccounts(accounts)
      .then(teamContract => {
        return Location.new() ///teamContract
      }).then(instance => {
        contract = instance;
        done();
      });     
    });

    it('should add a new location (location_1)', async () => {
      const res = await contract.addLocation(data.uri1, data.location1, {from: accounts[0]});
      expect(res).not.to.be.null;
      expect(res.receipt).to.be.an('object');
      expect(res.receipt.blockNumber).to.be.gt(0);
      expect(res.receipt.gasUsed).to.be.gt(0);
      expect(res.receipt.transactionHash).to.be.a('string');
    });

    it('should now have exacly one location', async () => {
      const count = await contract.getLocationCount.call();
      expect(nr(count)).to.be.equal(1);
    });

    it.skip('TODO: should be possible to get location_1 by index', async () => {
      const res = await contract.getLocationAtIndex.call(0);
      expect(t8(res[0])).to.equal(data.uri1);
      expect(t8(res[1])).to.equal(data.location1);
    });

    it('should be possible to get location_1 by URI', async () => {
      const res = await contract.getLocationByURI.call(f8(data.uri1));
      expect(t8(res[0])).to.equal(data.uri1);
      expect(t8(res[1])).to.equal(data.location1);
    });

    it('should not be possible to add location_1 URI again', async () => {
      try {
        const res = await contract.addLocation(data.uri1, data.location1);
        expect(res).to.be.null;
      } catch(e) {
        expect(e).to.be.an('error');

      }
    });

    it('add a new location (location_2)', async () => {
      const res = await contract.addLocation(data.uri2, data.location2, {from: accounts[0]});
      expect(res).not.to.be.null;
      expect(res.receipt).to.be.an('object');
      expect(res.receipt.blockNumber).to.be.gt(0);
      expect(res.receipt.gasUsed).to.be.gt(0);
      expect(res.receipt.transactionHash).to.be.a('string');
    });

    it('should now have exacly two locations', async () => {
      const count = await contract.getLocationCount.call();
      expect(nr(count)).to.be.equal(2);
    });

    it('should be possible to get location_2 by URI', async () => {
      const res = await contract.getLocationByURI.call(f8(data.uri2));
      expect(t8(res[0])).to.equal(data.uri2);
      expect(t8(res[1])).to.equal(data.location2);
    });
  });    
});