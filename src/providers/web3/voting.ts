import { AppStateTypes } from './../../states/types';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';
import { UserPoint } from '../../models/user-point';
import { LocationPoint } from '../../models/location-point';
import { AppStateProvider } from '../storage/app-state';
import { VotingState } from '../../states/voting';

// Import our contract artifacts and turn them into usable abstractions.
const votingArtifacts = require('../../../build/contracts/Voting.json');

/*
  Generated class for the Voting provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VotingProvider {

  private state: VotingState;

  constructor(private web3Provider: Web3Provider) {
    this.state = AppStateProvider.getInstance(AppStateTypes.VOTING) as VotingState;
  }


  // CONTRACT ACCESSORS

  async getVotingName(address: string) {
    if(!this.state.name[address]) {
      const name = await this.call(address, 'getVotingName');
      this.state.name[address] = await this.web3Provider.fromWeb3String(name);
    }
    return this.state.name[address];
  }

  async getVotingUsersCount(address: string): Promise<number> {
    if(!this.state.usersCount[address]) {
      const count = await this.call(address, 'getVotingUsersCount');
      this.state.usersCount[address] = this.web3Provider.fromWeb3Number(count);
    }
    return this.state.usersCount[address];
   }

  async getUserPointsByIndex(address: string, index: number): Promise<UserPoint> {
    if(!this.state.getUserPointsByIndex(address, index)) {
      const v = await this.call(address, 'getUserPointsByIndex', index);
      const accounts = await this.web3Provider.getAccounts();
      this.state.setUserPointsByIndex(address, index, new UserPoint(
        `Account: ${accounts.indexOf(v[0])}`, 
        await this.web3Provider.fromWeb3Number(v[1])
      ));
    }
    return this.state.getUserPointsByIndex(address, index);
  }

  async getVotedLocationsCount(address: string): Promise<number> {
    if(!this.state.locationsCount[address]) {
      const count = await this.call(address, 'getVotedLocationsCount');
      this.state.locationsCount[address] = await this.web3Provider.fromWeb3Number(count);
    }
    return this.state.locationsCount[address];
  }

  async getLocationPointsByIndex(address: string, index: number): Promise<LocationPoint> {
    if(!this.state.getLocationPointsByIndex(address, index)) {
      const v = await this.call(address, 'getLocationPointsByIndex', index);
      this.state.setLocationPointsByIndex(address, index, new LocationPoint(
        `Location: ${await this.web3Provider.fromWeb3String(v[0])}`, 
        await this.web3Provider.fromWeb3Number(v[1])
      ));
    }
    return this.state.getLocationPointsByIndex(address, index);
  }


  // TRANSACTIONS

  async addVote(address: string, uri: string, points: any) {
    uri = await this.web3Provider.toWeb3String(uri);
    points = await this.web3Provider.toWeb3Number(points);

    const account = await this.web3Provider.getAccount();
    const contract = await this.getContract(address);

    await contract.addVote(uri, points, { from: account, gas: 3000000 });

    this.state.resetLocationPoints(address);
    this.state.resetUserPoints(address);
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
    if(!this.state.contract[address]) {
      this.state.contract[address] = await this.web3Provider.getContractAt(votingArtifacts, address);
    }
    return this.state.contract[address];
  }

  private handleError(e: Error) {
    console.log(e);
  }
}