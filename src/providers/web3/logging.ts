import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
const loggingArtifacts = require('../../../build/contracts/Logging.json');

/*
  Generated class for the Logging provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoggingProvider {

  constructor(private web3Provider: Web3Provider,
              private settingsProvider: SettingsProvider) {
  }

  // CONTRACT ACCESSORS

  async getAddress(): Promise<string> {
    const address = await this.settingsProvider.getLoggingAddress();
    if(address) {
      return address;
    }
    return (await this.getDeployedContract()).address;
  }

  async addTeam(teamAddress, teamName) {
    console.time('addTeamToLogging');
    const contract = await this.web3Provider.getContractAt(loggingArtifacts, await this.getAddress());
    const account = await this.settingsProvider.getAccount();
    const trans = await contract.addTeam(teamAddress, teamName, {from: account, gas: 5000000});
    console.timeEnd('addTeamToLogging');
    return trans;
  }

  
  // INTERNAL

  private async getDeployedContract(): Promise<any> {
    return (await this.web3Provider.getRawContract(loggingArtifacts)).deployed();
  }
}