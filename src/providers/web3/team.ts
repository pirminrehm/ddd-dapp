import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

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
              private settingsProvider: SettingsProvider) {
  }


  // CONTRACT ACCESSORS

  async getPendingMembersCount(): Promise<number> {
    const count = await this.call('getPendingMembersCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getMembersCount(): Promise<number> {
    const count = await this.call('getMembersCount');
    return this.web3Provider.fromWeb3Number(count);
  }


  // TRANSACTIONS

  async createTeam(name: string, creatorName: string) {
    name = await this.web3Provider.toWeb3String(name);
    creatorName = await this.web3Provider.toWeb3String(creatorName);
    
    const contract = await this.web3Provider.getRawContract(teamArtifacts);
    const account = await this.web3Provider.getAccount();
    
    const team = await contract.new(name, creatorName, {from: account, gas: 3000000});
    await this.settingsProvider.setTeamAddress(team.address);
    return team;
  }

  async createInvitationToken() {
    const contract = await this.getContract();
    const account = await this.web3Provider.getAccount();
    return contract.createInvitationToken({from: account});
  }

  async sendJoinTeamRequest(account: string, name: string) {
    name = await this.web3Provider.toWeb3String(name);
    const contract = await this.getContract();
    return contract.sendJoinTeamRequest(name, { from: account, gas: 3000000 });
  }


  // EVENTS

  async onTokenCreated(callback: any) {
    const TokenCreated = (await this.getContract()).TokenCreated(); 
    this.listenTo(TokenCreated, args => callback(args.token));
  }

  // INTERNAL

  private async getContract(): Promise<any> {
    const address = await this.settingsProvider.getTeamAddress();
    return this.web3Provider.getContractAt(teamArtifacts, address);
  }

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      return contract[name].call(...params);
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private listenTo(Event: any, callback: any) {
    Event.watch((err, result) => {
      if(err) {
        throw err;
      }
      
      callback(result.args);
      Event.stopWatching();
    });
  }

  private handleError(e: Error) {
    console.log(e);
  }
}