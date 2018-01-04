export class Member {
  public account: string;
  public name: string;
  public avatarId: number
  
  constructor(account: string, name: string, avatarId: number) {
    this.account = account;
    this.name = name;
    this.avatarId = avatarId;
  }
}