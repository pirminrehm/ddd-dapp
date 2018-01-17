const Team = artifacts.require('./Team.sol');
const Location = artifacts.require('./Location.sol');
const Voting = artifacts.require('./Voting.sol');

Web3 = require('web3');
const web3 = new Web3();
const data = require('./helper/data.json');
const testHelper = require('./helper/testHelper');
const expect = require('chai').expect;

const nr = testHelper.nr;
const f8 = testHelper.f8;
const t8 = testHelper.t8;

contract('Team', (accounts) => {

  describe('Init-Tests', () => {
    before(done => {
      Team.new(f8('init_test_team'), f8('user_0_name'), 0, {from: accounts[0]})
      .then(instance => {
        contract = instance;
        done();
      });     
    });

    it('should not have inital any pending members', async () => {
      const count = await contract.getPendingMembersCount.call();
      expect(nr(count)).to.equal(0);
    });

    it('should have inital only the creator as member', async () => {
      const count = await contract.getMembersCount.call();
      expect(nr(count)).to.equal(1);
    });

    it('should check if the creator-member exists', async () => {
      const isMember = await contract.checkMemberByAddress.call(accounts[0]);
      expect(isMember).to.be.true;
    });

    it('should get the address, name and avatarId of the creator by index 0', async () => {
      const creator = await contract.getMemberByIndex.call(0);
      expect(creator[0]).to.equal(accounts[0]);
      expect(t8(creator[1])).to.equal('user_0_name');
      expect(nr(creator[2])).to.equal(0);
    });
    
    it('should have a team-name', async () => {
      const name = await contract.getTeamName.call();
      expect(t8(name)).to.be.equal('init_test_team');
    });

    it('should not have inital any votings', async () => {
      const count = await contract.getVotingsCount.call();
      expect(nr(count)).to.be.equal(0);
    });
  });
  
  describe('Story 1:', () => {
    var users;
    var invitationToken;
    var invitationToken2;
    var pendingMember;
    
    before(done => {
      users = [
        {name: 'user_0_name', avatarId: 17, account: accounts[0]},
        {name: 'user_1_name', avatarId: 11, account: accounts[1]},
        {name: 'user_2_name', avatarId: 93, account: accounts[2]},
        {name: 'user_3_name', avatarId: 12, account: accounts[3]}
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
      it('should create and return by event an invitation token', done => {
        let noLogWasRecieved = true;
        contract.TokenCreated().watch((error, log) => {
          if(noLogWasRecieved) {
            noLogWasRecieved = false;
            expect(log).to.be.an('object');
            expect(log.event).to.equal('TokenCreated');        
            expect(log.args).to.be.an('object');
            expect(log.args.token).to.be.a('string');
            invitationToken = log.args.token;
            contract.TokenCreated().stopWatching();
            done();
          }
        });

        contract.createInvitationToken({from: users[0].account}).then(res => { 
          expect(res).not.to.be.null;
        });
      });

      it('should not be possible to request an invitation token as non-member', async () => {
        try {
          const res = await contract.createInvitationToken({from: users[1].account});
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });

      it('should send a join team request by user_1', async () => {
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
        
      it('should request the pending member user_1 by index', async () => {
        pendingMember = await contract.getPendingMemberByIndex.call(0);
        expect(pendingMember[0]).to.equal(users[1].account);
        expect(t8(pendingMember[1])).to.equal(users[1].name);
        expect(nr(pendingMember[2])).to.equal(users[1].avatarId);
        expect(pendingMember[3]).to.equal(invitationToken);
      });

      it('should not be possible to accept user_1 self', async () => {
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

      it('should accept pending member user_1 by address', async () => {
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

      it('should now have two members', async () => {
        const count = await contract.getMembersCount.call();
        expect(nr(count)).to.equal(2);
      });

      it('should now have user_0 and user_1 as members', async () => {
        const m0 = await contract.getMemberByIndex.call(0);
        const m1 = await contract.getMemberByIndex.call(1);

        expect(m0[0]).to.equal(users[0].account);
        expect(t8(m0[1])).to.equal(users[0].name);
        expect(nr(m0[2])).to.equal(users[0].avatarId);

        expect(m1[0]).to.equal(users[1].account);
        expect(t8(m1[1])).to.equal(users[1].name);
        expect(nr(m1[2])).to.equal(users[1].avatarId);
      });     

      it('should not be possible to accept user_1 again as pending member', async () => {
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


    describe('user_1 invites user_2 and user_3', () => {
      it('should create and return an invitation token', async () => {
        const res = await contract.createInvitationToken({from: users[1].account});
        expect(res).not.to.be.null;
        expect(res.logs).to.be.an('array');
        expect(res.logs[0].args).to.be.an('object');
        expect(res.logs[0].args.token).to.be.a('string');
        invitationToken = res.logs[0].args.token;
      });

      it('should send a join team request by user_2', async () => {
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

      it('should create and return an invitation token', async () => {
        const res = await contract.createInvitationToken({from: users[1].account});
        expect(res).not.to.be.null;
        expect(res.logs).to.be.an('array');
        expect(res.logs[0].args).to.be.an('object');
        expect(res.logs[0].args.token).to.be.a('string');
        invitationToken2 = res.logs[0].args.token;
      });

      it('should send a join team request by user_3', async () => {
        const res = await contract.sendJoinTeamRequest( 
          invitationToken2,
          f8(users[3].name),
          users[3].avatarId,
          {from: users[3].account}
        );
        expect(res).not.to.be.null;
        expect(res.receipt).to.be.an('object');
        expect(res.receipt.blockNumber).to.be.gt(0);
        expect(res.receipt.gasUsed).to.be.gt(0);
        expect(res.receipt.transactionHash).to.be.a('string');
      });

      it('should now have two pending member', async () => {
        const count = await contract.getPendingMembersCount.call();
        expect(nr(count)).to.be.equal(2);
      });
    });

    describe('user_0 accepts user_3', () => {
      it('should request the pending member user_3 by index', async () => {
        pendingMember = await contract.getPendingMemberByIndex.call(1);
        expect(pendingMember[0]).to.equal(users[3].account);
        expect(t8(pendingMember[1])).to.equal(users[3].name);
        expect(nr(pendingMember[2])).to.equal(users[3].avatarId);
        expect(pendingMember[3]).to.equal(invitationToken2);
      });

      it('should accept pending member user_3 by address', async () => {
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

      it('should now have one pending member', async () => {
        const count = await contract.getPendingMembersCount.call();
        expect(nr(count)).to.be.equal(1);
      });

      it('should now have user_2 as pending members', async () => {
        const m2 = await contract.getPendingMemberByIndex.call(0);
        expect(m2[0]).to.equal(users[2].account);
        expect(t8(m2[1])).to.equal(users[2].name);
        expect(nr(m2[2])).to.equal(users[2].avatarId);
      });     

      it('should now have three members', async () => {
        const count = await contract.getMembersCount.call();
        expect(nr(count)).to.equal(3);
      });

      it('should now have user_3 as further members', async () => {
        const m2 = await contract.getMemberByIndex.call(2);

        expect(m2[0]).to.equal(users[3].account);
        expect(t8(m2[1])).to.equal(users[3].name);
        expect(nr(m2[2])).to.equal(users[3].avatarId);
      });     
    });

    describe('user_0 accepts user_2', () => {
      it('should request the pending member user_2 by index', async () => {
        pendingMember = await contract.getPendingMemberByIndex.call(0);
        expect(pendingMember[0]).to.equal(users[2].account);
        expect(t8(pendingMember[1])).to.equal(users[2].name);
        expect(nr(pendingMember[2])).to.equal(users[2].avatarId);
        expect(pendingMember[3]).to.equal(invitationToken);
      });

      it('should accept pending member user_2 by address', async () => {
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

      it('should now have four members', async () => {
        const count = await contract.getMembersCount.call();
        expect(nr(count)).to.equal(4);
      });

      it('should now have user_2 as further members', async () => {
        const m2 = await contract.getMemberByIndex.call(3);
        expect(m2[0]).to.equal(users[2].account);
        expect(t8(m2[1])).to.equal(users[2].name);
        expect(nr(m2[2])).to.equal(users[2].avatarId);
      });
    });
  });

  describe('Manage-Contracts-Tests', () => {
    describe('Location-Contract', () => {
      let locationInstance;
      before(done => {
        Team.new(f8('init_test_team'), f8('user_0_name'), 0, {from: accounts[0]})
        .then(instance => {
          contract = instance;
          done();
        });     
      });

      it('should get the address of the location contract', async () => {
        const locationAddress = await contract.getLocationAddress.call();
        expect(locationAddress).to.match(/^0x[a-f0-9]{40}$/);
        locationInstance = Location.at(locationAddress);
      });

      it('should get the location count by recieved address', async () => {
        const count = await locationInstance.getLocationCount.call();
        expect(nr(count)).to.be.equal(0);
      });

      it('should add a location by recieved address', async () => {
        const res = await locationInstance.addLocation(
          data.uri1,
          data.location1,
          {from: accounts[0]}
        );
        expect(res).not.to.be.null;
        expect(res.receipt).to.be.an('object');
        expect(res.receipt.blockNumber).to.be.gt(0);
        expect(res.receipt.gasUsed).to.be.gt(0);
        expect(res.receipt.transactionHash).to.be.a('string');
      });
      

      it('should get the new location count by recieved address', async () => {
        const count = await locationInstance.getLocationCount.call();
        expect(nr(count)).to.be.equal(1);
      });

      it('should not add a location due to non-member by recieved address', async () => {
        try {
          const res = await locationInstance.addLocation(
            data.uri2, 
            data.location2, 
            {from: accounts[1]}
          );
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });
    });

    describe('Voting-Contract', () => {
      let votingInstance1;
      let votingInstance2;
      before(done => {
        Team.new(f8('init_test_team'), f8('user_0_name'), 0, {from: accounts[0]})
        .then(instance => {
          contract = instance;
          return testHelper.addLocationsToTeam(contract, accounts[0]);
        }).then(loactionContract => {          
          done();
        });     
      });
      
      it('should create a new voting with the team contract', done => {
        let noLogWasRecieved = true;
        contract.VotingCreated().watch((error, log) => {
          if(noLogWasRecieved) {
            noLogWasRecieved = false;
            expect(log).to.be.an('object');
            expect(log.event).to.equal('VotingCreated');        
            expect(log.args).to.be.an('object');
            expect(log.args.votingAddress).to.be.a('string');
            let votingAddress = log.args.votingAddress;
            expect(votingAddress).to.match(/^0x[a-f0-9]{40}$/);
            votingInstance1 = Voting.at(votingAddress);
            contract.VotingCreated().stopWatching();
            done();
          }
        });

        contract.addVoting(data.votingName1, {from: accounts[0]}).then(res => { 
          expect(res).not.to.be.null;
        });        
      });

      it('should get the new votings count', async () => {
        const count = await contract.getVotingsCount.call();
        expect(nr(count)).to.be.equal(1);
      });

      it('should create a second voting with the team contract', done => {
        // delay -> don not receive first log twice
        setTimeout(() => {
          let noLogWasRecieved = true;
          contract.VotingCreated().watch((error, log) => {
            if(noLogWasRecieved) {
              noLogWasRecieved = false;
              expect(log).to.be.an('object');
              expect(log.event).to.equal('VotingCreated');        
              expect(log.args).to.be.an('object');
              expect(log.args.votingAddress).to.be.a('string');
              let votingAddress = log.args.votingAddress;
              expect(votingAddress).to.match(/^0x[a-f0-9]{40}$/);
              votingInstance2 = Voting.at(votingAddress);             
              contract.VotingCreated().stopWatching();
              done();
            }
          });

          contract.addVoting(data.votingName2, {from: accounts[0]}).then(res => { 
            expect(res).not.to.be.null;
          });        
        }, 500);
      });

      it('should get the new votings count', async () => {
        const count = await contract.getVotingsCount.call();
        expect(nr(count)).to.be.equal(2);
      });

      it('should get the first new voting by index', async () => {
        const voting = await contract.getVotingByIndex.call(0);
        expect(voting[0]).to.match(/^0x[a-f0-9]{40}$/);
        expect(voting[0]).to.equal(votingInstance1.address);
        expect(t8(voting[1])).to.equal(data.votingName1);
        expect(nr(voting[2])).to.be.gt(1516182195);
      });

      it('should get the second new voting by index', async () => {
        const voting = await contract.getVotingByIndex.call(1);
        expect(voting[0]).to.match(/^0x[a-f0-9]{40}$/);
        expect(voting[0]).to.equal(votingInstance2.address);
        expect(t8(voting[1])).to.equal(data.votingName2);
        expect(nr(voting[2])).to.be.gt(1516182195);
      });

      it("should add a new voting by recieved address", async () => {
        const res = await votingInstance1.addVote(data.uri1, 100 ,{from: accounts[0]});
        expect(res).not.to.be.null;
        expect(res.receipt).to.be.an('object');
        expect(res.receipt.blockNumber).to.be.gt(0);
        expect(res.receipt.gasUsed).to.be.gt(0);
        expect(res.receipt.transactionHash).to.be.a('string');
      });

      it("should not add a new voting by recieved address due to non-member", async () => {
        try {
          const res = await votingInstance1.addVote(data.uri1, 100 ,{from: accounts[1]});
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });

      it('should close the voting with the team contract', done => {
        let noLogWasRecieved = true;
        votingInstance1.VotingClosed().watch((error, log) => {
          if(noLogWasRecieved) {
            noLogWasRecieved = false;
            expect(log).to.be.an('object');
            expect(log.event).to.equal('VotingClosed');        
            expect(log.args).to.be.an('object');
            expect(log.args.winningLocation).to.be.a('string');
            winningLocation = t8(log.args.winningLocation);
            let random = nr(log.args.random);
            let sumOfAllPoints = nr(log.args.sumOfAllPoints);
            expect(winningLocation).to.equal(data.uri1);
            expect(sumOfAllPoints).to.equal(100);
            expect(random).to.be.at.least(0).and.at.most(100);
            votingInstance1.VotingClosed().stopWatching();
            done();
          }
        });
        // contract = team-contract
        contract.closeVotingStochastic(votingInstance1.address, {from: accounts[0]}).then(res=> {
          expect(res).not.to.be.null;
        });
      });

      it('should get the new votings count', async () => {
        const count = await contract.getVotingsCount.call();
        expect(nr(count)).to.be.equal(1);
      });

      it('should get the second and now only remaining voting by index', async () => {
        const voting = await contract.getVotingByIndex.call(0); //now index 0
        expect(voting[0]).to.match(/^0x[a-f0-9]{40}$/);
        expect(voting[0]).to.equal(votingInstance2.address);
        expect(t8(voting[1])).to.equal(data.votingName2);
        expect(nr(voting[2])).to.be.gt(1516182195);
        
      });

      it('should get the closed votings count', async () => {
        const count = await contract.getVotingsCount.call();
        expect(nr(count)).to.be.equal(1);
      });

      it('should get the closed voting by index', async () => {
        const voting = await contract.getClosedVotingByIndex.call(0);
        expect(voting[0]).to.match(/^0x[a-f0-9]{40}$/);
        expect(voting[0]).to.equal(votingInstance1.address);
        expect(t8(voting[1])).to.equal(data.votingName1);
        expect(nr(voting[2])).to.be.gt(1516182195);
      });

      it("should not close a voting due to non-member", done => {
        let noLogWasRecieved = true;
        votingInstance2.VotingClosed().watch((error, log) => {
          expect(log).to.be.null;
          expect(error).to.be.null;
          noLogWasRecieved = false;
        });
        setTimeout(() => { //wait 1 sec if voting closed event will get emitted
          if (noLogWasRecieved) {
            done();
          }
        }, 1000);    
        contract.closeVotingStochastic(votingInstance2.address ,{from: accounts[1]})
        .then(res => {
          expect(res).to.be.null;
        }).catch(e => {
          expect(e).to.be.an('error');
        });
      });

      it("should not close a not existing voting", async () => {
        try {
          const res = await contract.closeVotingStochastic(data.fakeAddress ,{from: accounts[0]});
          expect(res).to.be.null;
        } catch(e) {
          expect(e).to.be.an('error');
        }
      });
    });
  });
});
