import { IState } from './istate';

export class TeamState implements IState {

  public contract: any;
  public name: string;
  public creatorName: string;
  public locationAddress: string;

  public memberByIndex = [];
  public pendingMemberByIndex = [];
  public votingsByIndex = [];
  public closedVotingsByIndex = [];

  reset() {
    this.contract = null;
    this.name = null;
    this.creatorName = null;
    this.locationAddress = null;
    
    this.memberByIndex = [];
    this.pendingMemberByIndex = [];
    this.votingsByIndex = [];
    this.closedVotingsByIndex = [];
  }

  resetVotings() {
    this.votingsByIndex = [];
    this.closedVotingsByIndex = [];
  }
}
