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

  addVote(address: string, uri: string, points: any) {
    uri = this.web3Provider.toWeb3String(uri);
    points = this.web3Provider.toWeb3Number(points);
    
    return this.getContract()
      .then(c => c.addVote(uri, points, { from: address, gas: 3000000 }));
  }

  getVotingName() {
    return this.getContract()
      .then(c => c.getVotingName.call())
      .then(name => this.web3Provider.fromWeb3String(name))
      .catch(e => this.handleError(e));
  }

  getVotingUsersCount(): Promise<number> {
    return this.getContract()
      .then(c => c.getVotingUsersCount.call())
      .then(data => Number(data.toString(10)))
      .catch(e => this.handleError(e));
  }

  getUserPointsByIndex(index: number): Promise<UserPoint> {
    return this.getContract()
      .then(c => c.getUserPointsByIndex.call(index))
      //v[0] returns type 'address' -> do not cast toUtf8!
      .then(v => new UserPoint(
        `Account: ${this.web3Provider.getAccounts().indexOf(v[0])}`, 
        this.web3Provider.fromWeb3Number(v[1])
      ))
      .catch(e => this.handleError(e));
  }

  getVotedLocationsCount(): Promise<number> {
    return this.getContract()
      .then(c => c.getVotedLocationsCount.call())
      .then(data => this.web3Provider.fromWeb3Number(data))
      .catch(e => this.handleError(e));
  }

  getLocationPointsByIndex(index: number): Promise<LocationPoint> {
    return this.getContract()
      .then(c => c.getLocationPointsByIndex.call(index))
      .then(v => new LocationPoint(
        `Location: ${this.web3Provider.fromWeb3String(v[0])}`, 
        this.web3Provider.fromWeb3Number(v[1])
      ))
      .catch(e => this.handleError(e));
  }


  // HELPERS

  getAllUserPoints(): Promise<UserPoint[]> {
    return this.getVotingUsersCount().then(count => {
      const userPoints = [];
      var i = 0;
      while (i < count) {
        this.getUserPointsByIndex(i)
          .then(userPoint => userPoints.push(userPoint));
        i++;
      }
      return userPoints;
    });
  }

  getAllLocationPoints(): Promise<LocationPoint[]> {
    return this.getVotedLocationsCount().then(count => {
      const locationPoints = [];
      var i = 0;
      while (i < count) {
        this.getLocationPointsByIndex(i)
          .then(locationsPoint => locationPoints.push(locationsPoint));
        i++;
      }
      return locationPoints;
    });
  }


  // INTERNAL

  private getContract(): any {
    return this.web3Provider.getDeployedContract(votingArtifacts);
  }

  private handleError(e: Error) {
    console.log(e);
  }
}