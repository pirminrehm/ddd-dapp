import { Location } from "./location";

export class LocationPoint {
  public location: Location;
  public points: number;

  constructor(location: Location, points: number) {
    this.location = location;
    this.points = points;
  }
}