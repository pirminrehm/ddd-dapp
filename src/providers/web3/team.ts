import { CacheProvider } from './../storage/cache';
import { TeamInvitation } from './../../models/team-invitation';
import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';
import { PendingMember } from '../../models/pending-member';
import { Member } from './../../models/member';
import { VotingProvider } from './voting';

// Import our contract artifacts and turn them into usable abstractions.
const teamArtifacts = require('../../../build/contracts/Team.json');

/*
  Generated class for the Team provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TeamProvider {

  constructor(private web3Provider: Web3Provider,
              private settingsProvider: SettingsProvider,
              private votingProvider: VotingProvider,
              private cacheProvider: CacheProvider) {
  }


  // CONTRACT ACCESSORS
  async getTeamName(): Promise<string> {
    const name = await this.call('getTeamName');
    return this.web3Provider.fromWeb3String(name);
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

  async getLocationAddress(): Promise<string> {
    return this.call('getLocationAddress');
  }

  async getMemberByIndex(index: number): Promise<Member> {
    const v = await this.call('getMemberByIndex', index);
    const name = await this.web3Provider.fromWeb3String(v[1]);
    const avatarId = await this.web3Provider.fromWeb3Number(v[2]);

    return new Member(v[0], name, avatarId);
  }

  async getPendingMemberByIndex(index: number): Promise<PendingMember> {
    const v = await this.call('getPendingMemberByIndex', index);
    const name = await this.web3Provider.fromWeb3String(v[1]);
    const avatarId = await this.web3Provider.fromWeb3Number(v[2]);

    return new PendingMember(v[0], name, avatarId, v[3]);
  }

  async getVotingAddressByIndex(index: number): Promise<PendingMember> {
    return this.call('getVotingByIndex', index);
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

  async getVotingAddresses(): Promise<PendingMember[]> {
    const count = await this.getVotingsCount();
    const votings = [];
    for(let i = 0; i < count; i++) {
      votings.push(await this.getVotingAddressByIndex(i));
    }
    return votings;
  }


  // INTERNAL

  private async getContract(): Promise<any> {
    if(!this.cacheProvider.getTeamContract()) {
      const address = await this.settingsProvider.getTeamAddress();

      const contract = this.web3Provider.getContractAt(teamArtifacts, address)
      this.cacheProvider.setTeamContract(contract);
    }
    return this.cacheProvider.getTeamContract();
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