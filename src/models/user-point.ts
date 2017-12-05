export class UserPoint {
  private account: string;
  private points: number;

  constructor(account: string, points: number) {
    this.account = account;
    this.points = points;
  }
}