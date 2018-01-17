export class Voting {
  public address: string;
  public name: string;
  public timestamp: string
  
  constructor(address: string, name: string, timestamp: string) {
    this.address = address;
    this.name = name;
    this.timestamp = timestamp;
  }
}