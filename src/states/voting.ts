import { IState } from './istate';

export class VotingState implements IState {
  public contract = {};

  public name = {};
  public usersCount = {};
  public userPointsByIndex = {};
  public locationsCount = {};
  public locationPointsByIndex = {};

  reset() {
    this.contract = {};
    this.name = {};
    this.usersCount = {};
    this.userPointsByIndex = {};
    this.locationsCount = {};
    this.locationPointsByIndex = {};
  }
}
