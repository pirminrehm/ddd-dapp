export class TeamInvitation {
  private address: string;
  private token: string;

  constructor(address: string, token: string) {
    this.address = address;
    this.token = token;
  }

  asJson() {
    return JSON.stringify(this);
  }
}