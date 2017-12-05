import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
const locationArtifacts = require('../../../build/contracts/Location.json');

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

  // CONTRACT ACCESSORS

  getCount(): Promise<number> {
    return this.getContract()
      .then(c => c.getLocationCount.call())
      .then(data =>  this.web3Provider.fromWeb3Number(data))
      .catch(e => this.handleError(e));
  }

  getLocationAtIndex(index: number): Promise<Location> {
    return this.getContract()
      .then(c => c.getLocationAtIndex.call(index))
      .then(v => {
        const uri = this.web3Provider.fromWeb3String(v[0]);
        const name = this.web3Provider.fromWeb3String(v[1]);
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
    //.catch(e => this.handleError(e));
  }


  // HELPERS

  getAllLocations(): Promise<Location[]> {
    return this.getCount().then(count => {
      const locations = [];
      let i = 0;
      while (i < count) {
        this.getLocationAtIndex(i)
          .then(location => locations.push(location));
        i++;
      }
      return locations;
    });
  }


  // INTERNAL

  private getContract(): any {
    return this.web3Provider.getDeployedContract(locationArtifacts);
  }


  private handleError(e: Error) {
    console.log(e);
  }
}