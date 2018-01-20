import { IState } from './istate';

export class LocationState implements IState {

  public contract: any;

  public locationByIndex = [];
  public locationByURI = {};

  reset() {
    this.contract = null;
    
    this.locationByIndex = [];
    this.locationByURI = {}
  }
}
