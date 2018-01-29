import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { SettingsProvider } from '../../providers/storage/settings';

/**
 * Generated class for the AvatarSelectorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-avatar-selector',
  templateUrl: 'avatar-selector.html',
})
export class AvatarSelectorPage {

  constructor(private viewCtrl: ViewController,
              private settingsProvider: SettingsProvider) {
  }

  async selectAvatar(avatarId: number) {
    await this.settingsProvider.setAvatarId(avatarId);
    this.viewCtrl.dismiss(avatarId);
  }
}
