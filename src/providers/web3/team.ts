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

  constructor(private web3Provider: Web3Provider) {
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

  async sendJoinTeamRequest(account: string, name: string) {
    name = this.web3Provider.toWeb3String(name);
    const contract = await this.getContract();
    return contract.sendJoinTeamRequest(name, { from: account, gas: 3000000 });
  }


  // INTERNAL

  private getContract(): any {
    return this.web3Provider.getDeployedContract(teamArtifacts);
  }

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      return contract[name].call(...params);
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private handleError(e: Error) {
    console.log(e);
  }
}