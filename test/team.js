const Team = artifacts.require("./Team.sol");
Web3 = require("web3");
const web3 = new Web3();
const data = require('./data.json');

nr = (num) => Number(num.toString(10));

contract('Team', (accounts) => {

  let contract;
  let token;
  beforeEach((done) => {
    Team.deployed().then(instance => {
      contract = instance;
      done();
    });
  });

  describe('Unit Tests', () => {
    it("should not have inital any pending members", async () => {
      const count = await contract.getPendingMembersCount.call();
      assert.strictEqual(nr(count), 0, "Pending Users count is not 0");
    });
  
    it("should not have inital any members", async () => {
      const count = await contract.getMembersCount.call();
      assert.strictEqual(nr(count), 0, "Members count is not 0");
    });

    it("should create a validation token", async () => {
      const res = await contract.createInvitationToken({from: accounts[0]});
      assert.isNotNull(res, "Transaction returns null");
    });

    it("should send a join team request", async () => {
      const count = await contract.sendJoinTeamRequest(
        await contract.getInvitationToken.call(),
        web3.fromUtf8('test-name'),
        {from: accounts[0]}
      );
    });

    it('should now have one pending member', async () => {
      const count = await contract.getPendingMembersCount.call();
      assert.strictEqual(nr(count), 1, "Pending Users count is not 1");
    });

    it('should not be possible to send a request again', async () => {
      try {
        await contract.sendJoinTeamRequest(
          await contract.getInvitationToken.call(),
          web3.fromUtf8('test-name'),
          {from: accounts[0]}
        );
      } catch(e) {
        assert.typeOf(e, 'error', "No error was thrown");
      }
    });
  })

  describe('Story 1', () => {
  });

  describe('Story 2', () => {
  });
});