import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
const locationArtifacts = require('../../../build/contracts/Location.json');
const contract = require('truffle-contract');

/*
  Generated class for the Locations provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  constructor(private web3Provider: Web3Provider) {
  }

  getCount() {
    return this.getContract()
      .then(c => c.getLocationCount.call())
      .then(data =>  Number(data.toString(10)));
  }

  getLocationAtIndex(index: number) {
    return this.getContract().then(c => c.getLocationAtIndex.call(index));
  }

  addLocation(uri, name) {
    return this.getContract().then((instance) => {
      return instance.addLocation(uri, name, {
        from: this.web3Provider.getAccount(), 
        gas: 3000000 // TODO: Check gas.
      });
    });
  }

  private getContract(): any {
    const location = contract(locationArtifacts);
    location.setProvider(this.web3Provider.getWeb3().currentProvider);
    return location.deployed();
  }
}