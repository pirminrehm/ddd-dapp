import { AppStateTypes } from './../../states/types';
import { Injectable } from '@angular/core';

import { Web3Provider } from './web3';

// Import our contract artifacts and turn them into usable abstractions.
const locationArtifacts = require('../../../build/contracts/Location.json');

import { Location } from './../../models/location';
import { TeamProvider } from './team';
import { LocationState } from '../../states/location';
import { AppStateProvider } from '../storage/app-state';

/*
  Generated class for the Locations provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {

  private state: LocationState;

  constructor(private web3Provider: Web3Provider,
              private teamProvider: TeamProvider) {
    this.state = AppStateProvider.getInstance(AppStateTypes.LOCATION) as LocationState;
  }

  // CONTRACT ACCESSORS

  async getCount(): Promise<number> {
    if(!this.state.count) {
      const count = await this.call('getLocationCount');
      this.state.count = await this.web3Provider.fromWeb3Number(count);
    }
    return this.state.count;
  }

  async getLocationByIndex(index: number): Promise<Location> {
    if(!this.state.locationByIndex[index]) {
      const v = await this.call('getLocationByIndex', index);
      const uri = await this.web3Provider.fromWeb3String(v[0]);
      const name = await this.web3Provider.fromWeb3String(v[1]);
  
      this.state.locationByIndex[index] = new Location(uri, name);
    }
    return this.state.locationByIndex[index];
  }

  async addLocation(uri, name) {
    const contract = await this.getContract();
    const trans = await contract.addLocation(uri, name, {
      from: await this.web3Provider.getAccount(), 
      gas: 3000000 // TODO: Check gas.
    });

    this.state.count = null
    return trans;
  }


  // HELPERS

  async getLocations(): Promise<Location[]> {
    const count = await this.getCount();
    const locations = [];
    for(let i = 0; i < count; i++) {
      locations.push(await this.getLocationByIndex(i));
    }
    return locations;
  }


  // INTERNAL

  private async getContract(): Promise<any> {
    if(!this.state.contract) {
      const address = await this.teamProvider.getLocationAddress();
      this.state.contract = await this.web3Provider.getContractAt(locationArtifacts, address);
    }
    return this.state.contract;
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