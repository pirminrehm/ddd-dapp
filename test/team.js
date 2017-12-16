const Team = artifacts.require("./Team.sol");
Web3 = require("web3");
const web3 = new Web3();
const data = require('./data.json');
const expect = require('chai').expect;


let nr = num => Number(num.toString(10));
let f8 = str => web3.fromUtf8(str);
let t8 = str => web3.toUtf8(str);

contract('Team', (accounts) => {

  describe('Init-Tests', () => {
    before(done => {
      Team.new(f8('init_test_team'), f8('user_0_name'), 0, {from: accounts[0]})
      .then(instance => {
        contract = instance;
        done();
      });     
    });

    it("should not have inital any pending members", async () => {
      const count = await contract.getPendingMembersCount.call();
      expect(nr(count)).to.equal(0);
    });

    it("should have inital only the creator as member", async () => {
      const count = await contract.getMembersCount.call();
      expect(nr(count)).to.equal(1);
    });
  });
  
  describe('Story 1:', () => {
    var users;
    var invitationToken;
    var pendingMember;
    
    before(done => {
      users = [
        {name: 'user_0_name', avatarId: 17, account: accounts[0]},
        {name: 'user_1_name', avatarId: 11, account: accounts[1]},
        {name: 'user_2_name', avatarId: 93, account: accounts[2]}
      ]
      Team.new(
        f8('story_1_team'),
        f8(users[0].name),
        users[0].avatarId,
        {from: users[0].account})
      .then(instance => {
        contract = instance;
        done();
      });
    });
   
    describe('user_0 invites user_1:', () => {
      it("should create and return an invitation token", async () => {
        const res = await contract.createInvitationToken({from: users[0].account});
        expect(res).not.to.be.null;
        expect(res.logs).to.be.an('array');
        expect(res.logs[0].args).to.be.an('object');
        expect(res.logs[0].args.token).to.be.a('string');
        invitationToken = res.logs[0].args.token;
      });

      it("should not be possible to request an invitation token as non-member", async () => {
        try {
          const res = await contract.createInvitationToken({from: users[1].account});
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });

      it("should send a join team request by user_1", async () => {
        const res = await contract.sendJoinTeamRequest( 
          invitationToken,
          f8(users[1].name),
          users[1].avatarId,
          {from: users[1].account}
        );
        expect(res).not.to.be.null;
        expect(res.receipt).to.be.an('object');
        expect(res.receipt.blockNumber).to.be.gt(0);
        expect(res.receipt.gasUsed).to.be.gt(0);
        expect(res.receipt.transactionHash).to.be.a('string');
      });

      it('should now have one pending member', async () => {
        const count = await contract.getPendingMembersCount.call();
        expect(nr(count)).to.be.equal(1);
      });

      it('should not be possible to send a request again', async () => {
        try {
          const res = await contract.sendJoinTeamRequest(
            invitationToken,
            f8(users[1].name),
            {from: users[1].account}
          );
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });
    });
      
    describe('user_0 accepts user_1', () => {
      it('should now have one pending member', async () => {
        const count = await contract.getPendingMembersCount.call();
        expect(nr(count)).to.be.equal(1);
      });
        
      it("should request the pending member user_1 by index", async () => {
        pendingMember = await contract.getPendingMemberByIndex.call(0);
        expect(pendingMember[0]).to.equal(users[1].account);
        expect(t8(pendingMember[1])).to.equal(users[1].name);
        expect(nr(pendingMember[2])).to.equal(users[1].avatarId);
        expect(pendingMember[3]).to.equal(invitationToken);
      });

      it("should not be possible to accept user_1 self", async () => {
        try {
          const res = await contract.acceptPendingMember(
            pendingMember[0], // = users[1].account
            {from: users[1].account}
          );
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });

      it("should accept pending member user_1 by address", async () => {
        const res = await contract.acceptPendingMember(
          pendingMember[0],
          {from: users[0].account}
        );
        expect(res).not.to.be.null;
        expect(res.receipt).to.be.an('object');
        expect(res.receipt.blockNumber).to.be.gt(0);
        expect(res.receipt.gasUsed).to.be.gt(0);
        expect(res.receipt.transactionHash).to.be.a('string');
      });

      it('should now have zero pending member', async () => {
        const count = await contract.getPendingMembersCount.call();
        expect(nr(count)).to.be.equal(0);
      });

      it("should now have two members", async () => {
        const count = await contract.getMembersCount.call();
        expect(nr(count)).to.equal(2);
      });

      it("should now have user_0 and user_1 as members", async () => {
        const m0 = await contract.getMemberByIndex.call(0);
        const m1 = await contract.getMemberByIndex.call(1);

        expect(m0[0]).to.equal(users[0].account);
        expect(t8(m0[1])).to.equal(users[0].name);
        expect(nr(m0[2])).to.equal(users[0].avatarId);

        expect(m1[0]).to.equal(users[1].account);
        expect(t8(m1[1])).to.equal(users[1].name);
        expect(nr(m1[2])).to.equal(users[1].avatarId);
      });     

      it("should not be possible to accept user_1 again as pending member", async () => {
        try {
          const res = await contract.acceptPendingMember(
            pendingMember[0],
            {from: users[0].account}
          );
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });
    });


    describe('user_1 invites user_2', () => {
      it("should create and return an invitation token", async () => {
        const res = await contract.createInvitationToken({from: users[1].account});
        expect(res).not.to.be.null;
        expect(res.logs).to.be.an('array');
        expect(res.logs[0].args).to.be.an('object');
        expect(res.logs[0].args.token).to.be.a('string');
        invitationToken = res.logs[0].args.token;
      });

      it("should send a join team request by user_2", async () => {
        const res = await contract.sendJoinTeamRequest( 
          invitationToken,
          f8(users[2].name),
          users[2].avatarId,
          {from: users[2].account}
        );
        expect(res).not.to.be.null;
        expect(res.receipt).to.be.an('object');
        expect(res.receipt.blockNumber).to.be.gt(0);
        expect(res.receipt.gasUsed).to.be.gt(0);
        expect(res.receipt.transactionHash).to.be.a('string');
      });

      it('should now have one pending member', async () => {
        const count = await contract.getPendingMembersCount.call();
        expect(nr(count)).to.be.equal(1);
      });
    });

    describe('user_0 accepts user_2', () => {
      it("should request the pending member user_1 by index", async () => {
        pendingMember = await contract.getPendingMemberByIndex.call(0);
        expect(pendingMember[0]).to.equal(users[2].account);
        expect(t8(pendingMember[1])).to.equal(users[2].name);
        expect(nr(pendingMember[2])).to.equal(users[2].avatarId);
        expect(pendingMember[3]).to.equal(invitationToken);
      });

      it("should accept pending member user_1 by address", async () => {
        const res = await contract.acceptPendingMember(
          pendingMember[0],
          {from: users[0].account}
        );
        expect(res).not.to.be.null;
        expect(res.receipt).to.be.an('object');
        expect(res.receipt.blockNumber).to.be.gt(0);
        expect(res.receipt.gasUsed).to.be.gt(0);
        expect(res.receipt.transactionHash).to.be.a('string');
      });

      it('should now have zero pending member', async () => {
        const count = await contract.getPendingMembersCount.call();
        expect(nr(count)).to.be.equal(0);
      });

      it("should now have three members", async () => {
        const count = await contract.getMembersCount.call();
        expect(nr(count)).to.equal(3);
      });

      it("should now have user_3 as further members", async () => {
        const m2 = await contract.getMemberByIndex.call(2);

        expect(m2[0]).to.equal(users[2].account);
        expect(t8(m2[1])).to.equal(users[2].name);
        expect(nr(m2[2])).to.equal(users[2].avatarId);
      });     
    });
  });
});
