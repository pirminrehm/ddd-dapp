import { LoggingProvider } from './logging';
import { TeamState } from './../../states/team';
import { AppStateTypes } from './../../states/types';
import { TeamInvitation } from './../../models/team-invitation';
import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';
import { PendingMember } from '../../models/pending-member';
import { Member } from './../../models/member';
import { Voting } from './../../models/voting';

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
  private contractCallMutex: Boolean = false;
  
  constructor(private web3Provider: Web3Provider,
              private settingsProvider: SettingsProvider,
              private loggingProvider: LoggingProvider) {
                
    this.state = AppStateProvider.getInstance(AppStateTypes.TEAM) as TeamState;
  }


  // CONTRACT ACCESSORS
  async getTeamName(address = null): Promise<string> {
    if(!this.state.name) {
      let name;
      if(address) {
        name = await this.callAt(address, 'getTeamName');
      } else {
        name = await this.call('getTeamName');
      }
      this.state.name = await this.web3Provider.fromWeb3String(name);
    }
    return this.state.name;
  }

  async getPendingMembersCount(): Promise<number> {
    const count = await this.call('getPendingMembersCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getMembersCount(): Promise<number> {
    const count = await this.call('getMembersCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getVotingsCount(): Promise<number> {
    const count = await this.call('getVotingsCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getClosedVotingsCount(): Promise<number> {
    const count = await this.call('getClosedVotingsCount');
    return this.web3Provider.fromWeb3Number(count);
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
    // We can not cache the pending members by index since we manipulate the array in smart contract
    // TODO: Remove it from app state or provide a different implementation
    // if(!this.state.pendingMemberByIndex[index]) {
      const v = await this.call('getPendingMemberByIndex', index);
      const name = await this.web3Provider.fromWeb3String(v[1]);
      const avatarId = await this.web3Provider.fromWeb3Number(v[2]);
  
      this.state.pendingMemberByIndex[index] = new PendingMember(v[0], name, avatarId, v[3]);
    // }
    return this.state.pendingMemberByIndex[index]
  }

  async getVotingsByIndex(index: number): Promise<PendingMember> {
    // We can not cache the voting by index since we manipulate the array in smart contract
    // TODO: Remove it from app state or provide a different implementation
    // if(!this.state.votingsByIndex[index]) {
      let voting = await this.call('getVotingByIndex', index);
      this.state.votingsByIndex[index] = this.prepareVoting(voting);
    // }
    return this.state.votingsByIndex[index];
  }

  async getClosedVotingByIndex(index: number): Promise<PendingMember> {
    if(!this.state.closedVotingsByIndex[index]) {
      let voting = await this.call('getClosedVotingByIndex', index);
      this.state.closedVotingsByIndex[index] = this.prepareVoting(voting);
    }
    return this.state.closedVotingsByIndex[index];
  }

  // TRANSACTIONS

  async createTeam(name: string, creatorName: string, avatarId: number) {
    name = await this.web3Provider.toWeb3String(name);
    creatorName = await this.web3Provider.toWeb3String(creatorName);
    
    const contract = await this.web3Provider.getRawContract(teamArtifacts);
    const account = await this.web3Provider.getAccount();
    
    const team = await contract.new(name, creatorName, avatarId, {from: account, gas: 5000000});
    await this.loggingProvider.addTeam(team.address, name);
    await this.settingsProvider.setTeamAddress(team.address);
    return team;
  }

  async createInvitationToken() {
    const account = await this.web3Provider.getAccount();
    return this.transaction('createInvitationToken', {from: account});
  }

  async sendJoinTeamRequest(teamAddress: string, token: string, name: string, avatarId: number) {
    name = await this.web3Provider.toWeb3String(name);
    // TODO: avatarId = await this.web3Provider.toWeb3Number(avatarId);
    const account = await this.web3Provider.getAccount();
    
    return this.transactionAt(teamAddress, 'sendJoinTeamRequest', token, name, avatarId, {from: account, gas: 3000000});
  }

  async acceptPendingMember(address: string) {
    const account = await this.web3Provider.getAccount();
    return this.transaction('acceptPendingMember', address, {from: account, gas: 3000000});
  }

  async addVoting(name: string) {
    name = await this.web3Provider.toWeb3String(name);
    const account = await this.web3Provider.getAccount();
    return this.transaction('addVoting', name, {from: account, gas: 3000000});
  }

  async closeVoting(votingAddress: string) {
    const account = await this.web3Provider.getAccount();
    const trans = this.transaction('closeVotingStochastic', votingAddress, {from: account, gas: 3000000});
    this.state.resetVotings();
    return trans;
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

  async getVotings(): Promise<Voting[]> {
    const count = await this.getVotingsCount();
    const votings = [];
    for(let i = 0; i < count; i++) {
      votings.push(await this.getVotingsByIndex(i));
    }
    return votings;
  }


  async getLatestClosedVotings(limit = 5): Promise<Voting[]> {
    const count = await this.getClosedVotingsCount();
    if(count < limit) {
      limit = count;
    }

    const votings = [];
    for(let i = 0; i < limit; i++) {
      votings.push(await this.getClosedVotingByIndex((count-i) - 1));
    }
    return votings;
  }


  async isMember(address: string, account: string): Promise<Boolean> {
    const contract = await this.web3Provider.getContractAt(teamArtifacts, address);
    return contract.checkMemberByAddress.call(account);
  }


  // INTERNAL

  private async getContract(): Promise<any> {
    await this.waitForAndSetContractCallMutex();
    if(!this.state.contract) {
      const address = await this.settingsProvider.getTeamAddress();
      this.state.contract = await this.web3Provider.getContractAt(teamArtifacts, address);
    }
    this.resolveContractCallMutex();
    return this.state.contract;
  }

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      console.time(name);
      let callData = await contract[name].call(...params);
      console.timeEnd(name);
      return callData;
    } catch(e) {
      e => this.handleError(e);
    }
  }

    // INTERNAL
    private async callAt(address: string, name: string, ...params): Promise<any> {
      const contract = await this.web3Provider.getContractAt(teamArtifacts, address);
      try {
        return contract[name].call(...params);
      } catch(e) {
        e => this.handleError(e);
      }
    }

  private async transaction(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    const trans = await contract[name](...params);
    if(trans.receipt.status != '0x01') {
      return Promise.reject(
        `Transaction of ${name} failed with status code ${trans.receipt.status}`
      );
    }
  }
  private async transactionAt(address: string, name: string, ...params): Promise<any> {
    const contract = await this.web3Provider.getContractAt(teamArtifacts, address);
    const trans = await contract[name](...params);
    if(trans.receipt.status != '0x01') {
      return Promise.reject(
        `Transaction of ${name} failed with status code ${trans.receipt.status}`
      );
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

  private async waitForAndSetContractCallMutex(): Promise<any> {
    return new Promise(resolve => {
      let tryEntrance = () => {
        if (!this.contractCallMutex) {
          this.contractCallMutex = true;
          // console.log('mutex: close');
          resolve();
        } else {
          setTimeout(tryEntrance, 50);
        }
      };
      tryEntrance();
    });
  }

  private resolveContractCallMutex(): Promise<any> {
    this.contractCallMutex = false;
    // console.log('mutex: open');    
    return Promise.resolve();
  }


  private async prepareVoting(voting) {
    return new Voting(
      voting[0], 
      await this.web3Provider.fromWeb3String(voting[1]),
      new Date(await this.web3Provider.fromWeb3Number(voting[2])).toISOString()
    )
  }
  
}