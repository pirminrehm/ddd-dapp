import { IState } from './istate';

export class LocationState implements IState {

  public contract: any;
  public count: number;

  public locationByIndex = [];
  public locationByURI = {};

  reset() {
    this.contract = null;
    this.count = null;
    
    this.locationByIndex = [];
    this.locationByURI = {}
  }
}
