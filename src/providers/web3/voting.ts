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

  async getVotingName(address: string) {
    const name = await this.call(address, 'getVotingName');
    return this.web3Provider.fromWeb3String(name);
  }

  async getVotingUsersCount(address: string): Promise<number> {
    const count = await this.call(address, 'getVotingUsersCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getUserPointsByIndex(address: string, index: number): Promise<UserPoint> {
    const v = await this.call(address, 'getUserPointsByIndex', index);
    const accounts = await this.web3Provider.getAccounts();
    return new UserPoint(
      //v[0] returns type 'address' -> do not cast toUtf8!
      `Account: ${accounts.indexOf(v[0])}`, 
      await this.web3Provider.fromWeb3Number(v[1])
    );
  }

  async getVotedLocationsCount(address: string): Promise<number> {
    const count = await this.call(address, 'getVotedLocationsCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getLocationPointsByIndex(address: string, index: number): Promise<LocationPoint> {
    const v = await this.call(address, 'getLocationPointsByIndex', index);
    return new LocationPoint(
      `Location: ${await this.web3Provider.fromWeb3String(v[0])}`, 
      await this.web3Provider.fromWeb3Number(v[1])
    );
  }


  // TRANSACTIONS

  async addVote(address: string, uri: string, points: any) {
    uri = await this.web3Provider.toWeb3String(uri);
    points = await this.web3Provider.toWeb3Number(points);

    const account = await this.web3Provider.getAccount();
    const contract = await this.getContract(address);

    contract.addVote(uri, points, { from: account, gas: 3000000 });
  }

  // HELPERS

  async getAllUserPoints(address: string): Promise<UserPoint[]> {
    const count = await this.getVotingUsersCount(address);
    
    const userPoints = [];
    for(let i = 0; i < count; i++) {
      userPoints.push(await this.getUserPointsByIndex(address, i));
    }
    return userPoints;
  }

  async getAllLocationPoints(address: string): Promise<LocationPoint[]> {
    const count = await this.getVotedLocationsCount(address);

    const locationPoints = [];
    for(let i = 0; i < count; i++) {
      locationPoints.push(await this.getLocationPointsByIndex(address, i));
    }
    return locationPoints;
  }


  // INTERNAL
  private async call(address: string,name: string, ...params): Promise<any> {
    const contract =  await this.getContract(address);
    try {
      return contract[name].call(...params);
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private async getContract(address: string): Promise<any> {
    return this.web3Provider.getContractAt(votingArtifacts, address);
  }

  private handleError(e: Error) {
    console.log(e);
  }
}