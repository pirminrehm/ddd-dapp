import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { TeamProvider } from './../../providers/web3/team';
import { NotificationProvider } from './../../providers/notification/notification';

import { TeamInvitation } from './../../models/team-invitation';
import { Loader } from './../../models/loader';
import { PendingMember } from './../../models/pending-member';
import { Member } from './../../models/member';

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

  segmentArea = 'members';

  constructor(private teamProvider: TeamProvider,
              private notificationProvider: NotificationProvider) {
    this.pendingMembers = [];
    this.members = [];
    this.loader = new Loader(['members', 'pendingMembers', 'createInvitationToken']);    
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
    } catch(e) {
      this.notificationProvider.error(`An error occured while approving the member. ${pendingMember.name} remains unapproved`);
      console.log(e);
    }
  }

  private async stateChanged() {
    this.loader.activateAll();
    this.loader.deactivate('createInvitationToken');    
    
    if(this.teamAddress) {
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
