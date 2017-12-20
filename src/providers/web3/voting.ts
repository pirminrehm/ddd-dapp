import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';
import { UserPoint } from '../../models/user-point';
import { LocationPoint } from '../../models/location-point';

// Import our contract artifacts and turn them into usable abstractions.
const votingArtifacts = require('../../../build/contracts/Voting.json');

/*
  Generated class for the Voting provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VotingProvider {

  constructor(private web3Provider: Web3Provider) {
  }


  // CONTRACT ACCESSORS

  async getVotingName() {
    const name = await this.call('getVotingName');
    return this.web3Provider.fromWeb3String(name);
  }

  async getVotingUsersCount(): Promise<number> {
    const count = await this.call('getVotingUsersCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getUserPointsByIndex(index: number): Promise<UserPoint> {
    const v = await this.call('getUserPointsByIndex', index);
    const accounts = await this.web3Provider.getAccounts();
    return new UserPoint(
      //v[0] returns type 'address' -> do not cast toUtf8!
      `Account: ${accounts.indexOf(v[0])}`, 
      await this.web3Provider.fromWeb3Number(v[1])
    );
  }

  async getVotedLocationsCount(): Promise<number> {
    const count = await this.call('getVotedLocationsCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getLocationPointsByIndex(index: number): Promise<LocationPoint> {
    const v = await this.call('getLocationPointsByIndex', index);
    return new LocationPoint(
      `Location: ${this.web3Provider.fromWeb3String(v[0])}`, 
      await this.web3Provider.fromWeb3Number(v[1])
    );
  }


  // TRANSACTIONS

  async addVote(address: string, uri: string, points: any) {
    uri = await this.web3Provider.toWeb3String(uri);
    points = await this.web3Provider.toWeb3Number(points);
    
    const contract = await this.getContract()
    contract.addVote(uri, points, { from: address, gas: 3000000 });
  }

  // HELPERS

  async getAllUserPoints(): Promise<UserPoint[]> {
    const count = await this.getVotingUsersCount();
    
    const userPoints = [];
    for(let i = 0; i < count; i++) {
      userPoints.push(await this.getUserPointsByIndex(i));
    }
    return userPoints;
  }

  async getAllLocationPoints(): Promise<LocationPoint[]> {
    const count = await this.getVotedLocationsCount();

    const locationPoints = [];
    for(let i = 0; i < count; i++) {
      locationPoints.push(await this.getLocationPointsByIndex(i));
    }
    return locationPoints;
  }


  // INTERNAL

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      return contract[name].call(...params);
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private async getContract(): Promise<any> {
    return this.web3Provider.getDeployedContract(votingArtifacts);
  }

  private handleError(e: Error) {
    console.log(e);
  }
}