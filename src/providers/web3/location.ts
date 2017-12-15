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

  async getCount(): Promise<number> {
    const count = await this.call('getLocationCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getLocationAtIndex(index: number): Promise<Location> {
    const v = await this.call('getLocationAtIndex', index);

    const uri = this.web3Provider.fromWeb3String(v[0]);
    const name = this.web3Provider.fromWeb3String(v[1]);
    return new Location(uri, name);
  }

  async addLocation(uri, name) {
    const contract = await this.getContract();
    contract.addLocation(uri, name, {
      from: this.web3Provider.getAccount(), 
      gas: 3000000 // TODO: Check gas.
    });
  }


  // HELPERS

  async getAllLocations(): Promise<Location[]> {
    const count = await this.getCount();
    const locations = [];
    for(let i = 0; i < count; i++) {
      locations.push(await this.getLocationAtIndex(i));
    }
    return locations;
  }


  // INTERNAL

  private getContract(): any {
    return this.web3Provider.getDeployedContract(locationArtifacts);
  }

  private async call(name: string, ...params): Promise<any> {
    const contract =  await this.getContract();
    try {
      return contract[name].call(...params);
    } catch(e) {
      e => this.handleError(e);
    }
  }

  private handleError(e: Error) {
    console.log(e);
  }
}