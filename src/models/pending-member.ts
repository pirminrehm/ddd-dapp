export class PendingMember {
  public account: string;
  public name: string;
  public avatarId: number
  public invitationToken: string;

  constructor(account: string, name: string, avatarId: number, invitationToken: string) {
    this.account = account;
    this.name = name;
    this.avatarId = avatarId;
    this.invitationToken = invitationToken;
  }
}