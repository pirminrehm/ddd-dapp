import { Component, Input, OnChanges } from '@angular/core';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { Subject } from 'rxjs/Subject';

import { TeamProvider } from './../../providers/web3/team';
import { SettingsProvider } from './../../providers/storage/settings';
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
  segmentArea = 'members';

  teamInvitation: TeamInvitation;
  pendingMembers: PendingMember[];
  members: Member[];
  loader: Loader;
  userAccount: string;

  refreshSubject: Subject<any>;

  constructor(private alertCtrl: AlertController, 
              private teamProvider: TeamProvider,
              private notificationProvider: NotificationProvider,
              private settingsProvider: SettingsProvider) {
    this.pendingMembers = [];
    this.members = [];
    this.loader = new Loader(['members', 'pendingMembers', 'createInvitationToken']);    
    this.refreshSubject = new Subject();
  }

  ngOnChanges() {
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
      console.log(this.teamInvitation, 'CREATED TEAM INVITATION');
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
      this.notificationProvider.error(`An error occured while approving the member. 
        ${pendingMember.name} remains unapproved`);
      console.log(e);
    }
  }

  doRefresh(refresher) {
    if(this.segmentArea == 'createToken') {
      this.createInvitationToken();
    }
    
    this.stateChanged();
    // Add Timeout to wait at least 1 sec
    setTimeout(() => refresher.complete(), 1000);
  }

  private async stateChanged() {
    this.refreshSubject.next();
    this.loader.activateAll();
    this.loader.deactivate('createInvitationToken');

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

  confirmPendingMember(pendingMember: PendingMember) {
    const alert = this.alertCtrl.create({
      title: 'Confirm ' + pendingMember.name,
      message: `Do you want to confirm ${pendingMember.name}?`,
      cssClass: 'alert-dark',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: () => {
            this.acceptPendingMember(pendingMember);
          }
        }
      ]
    });
    alert.present();
  }
}
