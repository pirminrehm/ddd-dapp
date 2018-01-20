import { Injectable } from '@angular/core';

// Import our contract artifacts and turn them into usable abstractions.
const votingArtifacts = require('../../../build/contracts/Voting.json');

import { Web3Provider } from './web3';
import { AppStateProvider } from '../storage/app-state';
import { LocationProvider } from './location';

import { UserPoint } from '../../models/user-point';
import { LocationPoint } from '../../models/location-point';
import { Location } from './../../models/location';
import { AppStateTypes } from './../../states/types';
import { VotingState } from '../../states/voting';

/*
  Generated class for the Voting provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VotingProvider {

  private state: VotingState;

  constructor(private web3Provider: Web3Provider,
              private locationProvider: LocationProvider) {
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
    const count = await this.call(address, 'getVotingUsersCount');
    return this.web3Provider.fromWeb3Number(count);
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
    const count = await this.call(address, 'getVotedLocationsCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getLocationPointsByIndex(address: string, index: number): Promise<LocationPoint> {
    if(!this.state.getLocationPointsByIndex(address, index)) {
      const v = await this.call(address, 'getLocationPointsByIndex', index);
      
      const uri = await this.web3Provider.fromWeb3String(v[0]);
      this.state.setLocationPointsByIndex(address, index, new LocationPoint(
        await this.locationProvider.getLocationByURI(uri),
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

    const trans = await contract.addVote(uri, points, { from: account, gas: 3000000 });

    this.state.resetLocationPoints(address);
    this.state.resetUserPoints(address);

    return trans;
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

  async getLocationPoints(address: string): Promise<LocationPoint[]> {
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
      console.time('clonedVotingArtifacts');
      let clonedVotingArtifacts = JSON.parse(JSON.stringify(votingArtifacts));
      console.timeEnd('clonedVotingArtifacts');      
      this.state.contract[address] = await this.web3Provider.getContractAt(clonedVotingArtifacts, address);
    }
    return this.state.contract[address];
  }

  private handleError(e: Error) {
    console.log(e);
  }
}