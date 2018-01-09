import { IState } from './istate';

export class TeamState implements IState {

  public address: string;
  public name: string;
  public creatorName: string;
  public pendingMembersCount: number;
  public membersCount: number;
  public votingsCount: number;
  public locationAddress: string;

  public memberByIndex = [];
  public pendingMemberByIndex = [];
  public votingAddressByIndex = [];

  reset() {
    this.address = null;
    this.name = null;
    this.creatorName = null;
    this.pendingMembersCount = null;
    this.membersCount = null;
    this.votingsCount = null;
    this.locationAddress = null;
    
    this.memberByIndex = [];
    this.pendingMemberByIndex = [];
    this.votingAddressByIndex = [];
  }
}
