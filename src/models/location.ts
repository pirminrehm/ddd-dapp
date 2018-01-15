export class Location {
  public name: string;
  public uri: string;

  constructor(uri: string, name: string) {
    this.uri = uri;
    this.name = name;
  }
}