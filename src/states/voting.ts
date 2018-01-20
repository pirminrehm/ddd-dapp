import { IState } from './istate';

export class VotingState implements IState {
  public contract = {};

  public name = {};
  
  private locationPointsByIndexData = {};
  private userPointsByIndexData = {};

  getLocationPointsByIndex(address, index) {
    if(!this.locationPointsByIndexData[address]) {
      this.locationPointsByIndexData[address] = {};
    }
    return this.locationPointsByIndexData[address][index];
  }
  setLocationPointsByIndex(address, index, locationPoints) {
    if(!this.locationPointsByIndexData[address]) {
      this.locationPointsByIndexData[address] = {};
    }
    this.locationPointsByIndexData[address][index] = locationPoints;
  }
  resetLocationPoints(address) {
    this.locationPointsByIndexData[address] = {};
  }

  getUserPointsByIndex(address, index) {
    if(!this.userPointsByIndexData[address]) {
      this.userPointsByIndexData[address] = {};
    }
    return this.userPointsByIndexData[address][index];
  }
  setUserPointsByIndex(address, index, userPoints) {
    if(!this.userPointsByIndexData[address]) {
      this.userPointsByIndexData[address] = {};
    }
    this.userPointsByIndexData[address][index] = userPoints;
  }
  resetUserPoints(address) {
    this.userPointsByIndexData[address] = {};
  }


  reset() {
    this.contract = {};
    this.name = {};
    this.userPointsByIndexData = {};
    this.locationPointsByIndexData = {};
  }
}
