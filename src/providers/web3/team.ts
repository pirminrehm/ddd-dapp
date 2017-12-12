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

  sendJoinTeamRequest(account: string, name: string) {
    name = this.web3Provider.toWeb3String(name);
    return this
      .getContract()
      .then(c => {
        console.log(c, "CONTRACT");
        console.log(account);
        return c.sendJoinTeamRequest(name, { from: account, gas: 3000000 })});
  }

  getPendingMembersCount(): Promise<number> {
    return this.getContract()
      .then(c => c.getPendingMembersCount.call())
      .then(data => this.web3Provider.fromWeb3Number(data))
      .catch(e => this.handleError(e));
  }

  getMembersCount(): Promise<number> {
    return this.getContract()
    .then(c => c.getMembersCount.call())
    .then(data => this.web3Provider.fromWeb3Number(data))
    .catch(e => this.handleError(e));
  }


  // INTERNAL

  private getContract(): any {
    return this.web3Provider.getDeployedContract(teamArtifacts);
  }

  private handleError(e: Error) {
    console.log(e);
  }
}