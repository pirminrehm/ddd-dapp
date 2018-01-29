import { SettingsProvider } from './../storage/settings';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TeamProvider } from '../web3/team';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the MemberApprovedProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MemberApprovedProvider {
  private subject = new Subject<string>();

  constructor(private settingsProvider: SettingsProvider,
              private teamProvider: TeamProvider) {
  }

  async doCheck(teamAddress = null, account = null) {
    if(await this.settingsProvider.getTeamAddress()) {
      console.log('CHECKED FOR APPROVAL: User is a member');
      return;
    }

    if(!teamAddress) {
      teamAddress = await this.settingsProvider.getPendingTeamAddress();
      if(!teamAddress) {
        console.log("CHECKED FOR APPROVAL: No Pending team address specified");
        return;
      }
    }
    if(!account) {
      account = await this.settingsProvider.getAccount();
    }

    if(await this.teamProvider.isMember(teamAddress, account)) {
      await this.settingsProvider.setPendingTeamAddress(null);
      await this.settingsProvider.setTeamAddress(teamAddress);
      
      // Notify observers
      this.subject.next(teamAddress);
    } else {
      console.count('CHECKED FOR APPROVAL: Not approved so far, setting timeout');
      setTimeout(() => this.doCheck(teamAddress, account), 5000);
    }
  }

  onApproved(): Observable<string> {
    return this.subject.asObservable();
  }
}