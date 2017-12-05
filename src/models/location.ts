export class Location {
  private name: string;
  private uri: string;

  constructor(uri: string, name: string) {
    this.uri = uri;
    this.name = name;
  }
}