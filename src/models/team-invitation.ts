export class TeamInvitation {
  public address: string;
  public token: string;

  constructor(address: string, token: string) {
    this.address = address;
    this.token = token;
  }

  asJson() {
    return JSON.stringify(this);
  }
}