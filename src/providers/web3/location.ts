import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
const locationArtifacts = require('../../../build/contracts/Location.json');
const contract = require('truffle-contract');

import { Location } from './../../models/location';

/*
  Generated class for the Locations provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  constructor(private web3Provider: Web3Provider) {
  }

  getCount(): Promise<number> {
    return this.getContract()
      .then(c => c.getLocationCount.call())
      .then(data =>  Number(data.toString(10)))
      .catch(e => this.handleError(e));
  }

  getLocationAtIndex(index: number): Promise<Location> {
    return this.getContract()
      .then(c => c.getLocationAtIndex.call(index))
      .then(v => {
        const uri = this.web3Provider.getWeb3().toUtf8(v[0]);
        const name = this.web3Provider.getWeb3().toUtf8(v[1]);
        return new Location(uri, name);
      })
      .catch(e => this.handleError(e));
  }

  addLocation(uri, name) {
    return this.getContract().then((instance) => {
      return instance.addLocation(uri, name, {
        from: this.web3Provider.getAccount(), 
        gas: 3000000 // TODO: Check gas.
      });
    })
    .catch(e => this.handleError(e));
  }

  private getContract(): any {
    const location = contract(locationArtifacts);
    location.setProvider(this.web3Provider.getWeb3().currentProvider);
    return location.deployed();
  }


  private handleError(e: Error) {
    console.log(e);
  }
}