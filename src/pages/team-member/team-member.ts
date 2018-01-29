import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { TeamProvider } from './../../providers/web3/team';
import { NotificationProvider } from './../../providers/notification/notification';

import { TeamInvitation } from './../../models/team-invitation';
import { Loader } from './../../models/loader';
import { PendingMember } from './../../models/pending-member';
import { Member } from './../../models/member';

import { Subject } from 'rxjs/Subject';

/**
 * Generated class for the TeamMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-team-member',
  templateUrl: 'team-member.html',
})
export class TeamMemberPage implements OnChanges {
  @Input() teamAddress: string;

  teamInvitation: TeamInvitation;

  pendingMembers: PendingMember[];
  members: Member[];
  loader: Loader;

  refreshSubject: Subject<any>;

  userAccount: string;

  segmentArea = 'members';

  constructor(private teamProvider: TeamProvider,
              private notificationProvider: NotificationProvider,
              private settingsProvider: SettingsProvider) {
    this.pendingMembers = [];
    this.members = [];
    this.loader = new Loader(['members', 'pendingMembers', 'createInvitationToken']);    
    this.refreshSubject = new Subject();


  }

  ngOnChanges() {
    console.log('STATE CHANGED TEAM MEMBER')
    if(this.teamAddress) {
      this.stateChanged();
    }
  }

  createFirstInvitiationToken() {
    if(!this.teamInvitation) {
      this.createInvitationToken();
    }
  }

  createInvitationToken() {
    this.loader.activate('createInvitationToken');
    this.teamProvider.onTokenCreated().then(teamInvitation => {
      this.teamInvitation = teamInvitation;
      console.log(this.teamInvitation);
      this.loader.deactivate('createInvitationToken');
    });

    this.teamProvider.createInvitationToken();
  }

  async acceptPendingMember(pendingMember: PendingMember) {
    try {
      await this.teamProvider.acceptPendingMember(pendingMember.account);
      this.notificationProvider.success(`Pending user ${pendingMember.name} added`);
      this.stateChanged();
    } catch(e) {
      this.notificationProvider.error(`An error occured while approving the member. ${pendingMember.name} remains unapproved`);
      console.log(e);
    }
  }

  async doRefresh(refresher) {
    this.stateChanged();

    // TODO: Listen to stateChanged callback
    setTimeout(() => refresher.complete(), 1000);
  }

  private async stateChanged() {
    this.refreshSubject.next();
    this.loader.activateAll();
    this.loader.deactivate('createInvitationToken');    
    
    if(this.teamAddress) {
      this.userAccount = await this.settingsProvider.getAccount();
      this.teamProvider.getMembers().then(members => {
        this.members = members;
        this.loader.deactivate('members');
      });
      this.teamProvider.getPendingMembers().then(pendingMembers =>  {
        this.pendingMembers = pendingMembers;
        this.loader.deactivate('pendingMembers');
      });
    }
  }

}
