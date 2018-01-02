import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
const locationArtifacts = require('../../../build/contracts/Location.json');

import { Location } from './../../models/location';
import { TeamProvider } from './team';

/*
  Generated class for the Locations provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  constructor(private web3Provider: Web3Provider,
              private teamProvider: TeamProvider) {
  }

  // CONTRACT ACCESSORS

  async getCount(): Promise<number> {
    const count = await this.call('getLocationCount');
    return this.web3Provider.fromWeb3Number(count);
  }

  async getLocationByIndex(index: number): Promise<Location> {
    const v = await this.call('getLocationByIndex', index);
    const uri = await this.web3Provider.fromWeb3String(v[0]);
    const name = await this.web3Provider.fromWeb3String(v[1]);

    return new Location(uri, name);
  }

  async addLocation(uri, name) {
    const contract = await this.getContract();
    contract.addLocation(uri, name, {
      from: await this.web3Provider.getAccount(), 
      gas: 3000000 // TODO: Check gas.
    });
  }


  // HELPERS

  async getAllLocations(): Promise<Location[]> {
    const count = await this.getCount();
    console.log(count, 'COUNT');
    const locations = [];
    for(let i = 0; i < count; i++) {
      locations.push(await this.getLocationByIndex(i));
    }
    return locations;
  }


  // INTERNAL

  private async getContract(): Promise<any> {
    const address = await this.teamProvider.getLocationAddress();
    return this.web3Provider.getContractAt(locationArtifacts, address);
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