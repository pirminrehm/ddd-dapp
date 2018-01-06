import { IState } from './istate';

export class TeamState implements IState {

  public address: string;
  public name: string;
  public creatorName: string;

  reset() {
    this.address = null;
    this.name = null;
    this.creatorName = null;
  }
}
