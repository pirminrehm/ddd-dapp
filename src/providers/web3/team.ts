import { TeamState } from './../../states/team';
import { AppStateTypes } from './../../states/types';
import { TeamInvitation } from './../../models/team-invitation';
import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';
import { PendingMember } from '../../models/pending-member';
import { Member } from './../../models/member';
import { VotingProvider } from './voting';
import { AppStateProvider } from '../storage/app-state';

// Import our contract artifacts and turn them into usable abstractions.
const teamArtifacts = require('../../../build/contracts/Team.json');

/*
  Generated class for the Team provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamProvider {

  private state: TeamState;

  constructor(private web3Provider: Web3Provider,
              private settingsProvider: SettingsProvider,
              private votingProvider: VotingProvider) {
                
    this.state = AppStateProvider.getInstance(AppStateTypes.TEAM) as TeamState;
  }


  // CONTRACT ACCESSORS
  async getTeamName(): Promise<string> {
    if(!this.state.name) {
      let name = await this.call('getTeamName');
      this.state.name = await this.web3Provider.fromWeb3String(name);
    }
    return this.state.name;
  }

  async getPendingMembersCount(): Promise<number> {
    if(!this.state.pendingMembersCount) {
      const count = await this.call('getPendingMembersCount');
      this.state.pendingMembersCount = await this.web3Provider.fromWeb3Number(count);
    }
    return this.state.pendingMembersCount;
  }

  async getMembersCount(): Promise<number> {
    if(!this.state.membersCount) {
      const count = await this.call('getMembersCount');
      this.state.membersCount = await this.web3Provider.fromWeb3Number(count);
    }
    return this.state.membersCount;
  }

  async getVotingsCount(): Promise<number> {
    if(!this.state.votingsCount) {
      const count = await this.call('getVotingsCount');
      this.state.votingsCount = await this.web3Provider.fromWeb3Number(count);
    }
    return this.state.votingsCount;
  }

  async getLocationAddress(): Promise<string> {
    if(!this.state.locationAddress) {
      this.state.locationAddress = await this.call('getLocationAddress');
    }
    return this.state.locationAddress;
  }

  async getMemberByIndex(index: number): Promise<Member> {
    if(!this.state.memberByIndex[index]) {
      const v = await this.call('getMemberByIndex', index);
      const name = await this.web3Provider.fromWeb3String(v[1]);
      const avatarId = await this.web3Provider.fromWeb3Number(v[2]);
      this.state.memberByIndex[index] = new Member(v[0], name, avatarId);
    }
    return this.state.memberByIndex[index];
  }

  async getPendingMemberByIndex(index: number): Promise<PendingMember> {
    if(!this.state.pendingMemberByIndex[index]) {
      const v = await this.call('getPendingMemberByIndex', index);
      const name = await this.web3Provider.fromWeb3String(v[1]);
      const avatarId = await this.web3Provider.fromWeb3Number(v[2]);
  
      this.state.pendingMemberByIndex[index] = new PendingMember(v[0], name, avatarId, v[3]);
    }
    return this.state.pendingMemberByIndex[index]
  }

  async getVotingAddressByIndex(index: number): Promise<PendingMember> {
    if(!this.state.votingAddressByIndex[index]) {
      this.state.votingAddressByIndex[index] = await this.call('getVotingByIndex', index);
    }
    return this.state.votingAddressByIndex[index];
  }

  // TRANSACTIONS

  async createTeam(name: string, creatorName: string) {
    name = await this.web3Provider.toWeb3String(name);
    creatorName = await this.web3Provider.toWeb3String(creatorName);
    
    const contract = await this.web3Provider.getRawContract(teamArtifacts);
    const account = await this.web3Provider.getAccount();
    
    const team = await contract.new(name, creatorName, {from: account, gas: 5000000});
    await this.settingsProvider.setTeamAddress(team.address);
    return team;
  }

  async createInvitationToken() {
    const contract = await this.getContract();
    const account = await this.web3Provider.getAccount();
    return contract.createInvitationToken({from: account});
  }

  async sendJoinTeamRequest(teamAddress: string, token: string, name: string, avatarId: number) {
    name = await this.web3Provider.toWeb3String(name);
    // TODO: avatarId = await this.web3Provider.toWeb3Number(avatarId);
    const contract = await this.web3Provider.getContractAt(teamArtifacts, teamAddress);
    const account = await this.web3Provider.getAccount();
    
    return contract.sendJoinTeamRequest(token, name, avatarId, {from: account, gas: 3000000});
  }

  async acceptPendingMember(address: string) {
    const contract = await this.getContract();
    const account = await this.web3Provider.getAccount();
    return contract.acceptPendingMember(address, {from: account, gas: 3000000});
  }

  async addVoting(name: string) {
    name = await this.web3Provider.toWeb3String(name);

    const contract = await this.getContract();
    const account = await this.web3Provider.getAccount();
    return contract.addVoting(name, {from: account, gas: 3000000});
  }

  // EVENTS

  async onTokenCreated(): Promise<any> {
    const TokenCreated = (await this.getContract()).TokenCreated(); 
    const res = await this.listenOnce(TokenCreated);
    return new TeamInvitation(res.address, res.args.token);
  }

  async onVotingCreated(): Promise<any> {
    const VotingCreated = (await this.getContract()).VotingCreated(); 
    const res = await this.listenOnce(VotingCreated);
    
    this.state.votingsCount += 1;
    return res.args.votingAddress;
  }

  // HELPERS

  async getMembers(): Promise<Member[]> {
    const count = await this.getMembersCount();
    const members = [];
    for(let i = 0; i < count; i++) {
      members.push(await this.getMemberByIndex(i));
    }
    return members;
  }


  async getPendingMembers(): Promise<PendingMember[]> {
    const count = await this.getPendingMembersCount();
    const pendingMembers = [];
    for(let i = 0; i < count; i++) {
      pendingMembers.push(await this.getPendingMemberByIndex(i));
    }
    return pendingMembers;
  }

  async getVotingAddresses(): Promise<string[]> {
    const count = await this.getVotingsCount();
    const votings = [];
    for(let i = 0; i < count; i++) {
      votings.push(await this.getVotingAddressByIndex(i));
    }
    return votings;
  }


  // INTERNAL

  private async getContract(): Promise<any> {
    if(!this.state.address) {
      const address = await this.settingsProvider.getTeamAddress();
      this.state.address = await this.web3Provider.getContractAt(teamArtifacts, address);
    }
    return this.state.address;
  }

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      return contract[name].call(...params);
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private listenOnce(Event: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Event.watch((err, result) => {
        if(err) {
          reject(err);
          throw err;
        }
        
        resolve(result);
        Event.stopWatching();
      });
    });
  }

  private handleError(e: Error) {
    console.log(e);
  }
}