import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
const votingArtifacts = require('../../../build/contracts/Voting.json');
const contract = require('truffle-contract');

import { LocationPoint, UserPoint } from './../../pages/voting/voting';

/*
  Generated class for the Voting provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VotingProvider {

  constructor(private web3Provider: Web3Provider) {
  }


  addVote(address: string, uri: string, points: any) {
    uri = this.web3Provider.getWeb3().fromUtf8(uri);
    points = this.web3Provider.getWeb3().toBigNumber(points);
    
    return this.getContract()
      .then(c => c.addVote(uri, points, { from: address, gas: 3000000 }));
  }

  getVotingName() {
    return this.getContract()
      .then(c => c.getVotingName.call())
      .then(name => this.web3Provider.getWeb3().toUtf8(name));
  }

  getVotingUsersCount(): Promise<number> {
    return this.getContract()
      .then(c => c.getVotingUsersCount.call())
      .then(data => Number(data.toString(10)));
  }

  getUserPointsByIndex(index: number): Promise<UserPoint> {
    return this.getContract()
      .then(c => c.getUserPointsByIndex.call(index))
      .then(v => {
        return {
          account: `Account: ${v[0]}`, 
          points: Number(v[1].toString(10))
        };
      });
  }

  getVotedLocationsCount(): Promise<number> {
    return this.getContract()
      .then(c => c.getVotedLocationsCount.call())
      .then(data => Number(data.toString(10)));
  }

  getLocationPointsByIndex(index: number): Promise<LocationPoint> {
    return this.getContract()
      .then(c => c.getUserPointsByIndex.call(index))
      .then(v => {
        // const uri = this.web3Provider.getWeb3().toUtf8(v[0]);
        return {
          "uri": 'TODO',
          "points": Number(v[1].toString(10))
        }
      });
  }


  private getContract(): any {
    const voting = contract(votingArtifacts);
    voting.setProvider(this.web3Provider.getWeb3().currentProvider);
    return voting.deployed();
  }
}