import { IState } from './istate';

export class LocationState implements IState {

  public contract: any;
  public count: number;

  public locationByIndex = [];

  reset() {
    this.contract = null;
    this.count = null;
    
    this.locationByIndex = [];
  }
}
