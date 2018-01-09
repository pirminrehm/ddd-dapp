export class Loader {
  private resources: Array<any>;
  private firstInit:boolean = true;

  constructor(resources: Array<any>) {
    this.resources = resources;
    for (let i=0; i<resources.length; i++) {
      this[resources[i]] = -1;
    }
  }

  public activate(resource: any) {
    this[resource] = 1;
  }

  public deactivate(resource: any) {
    this[resource] = 0;
  }

  public test123() {
  }

  public activateAll() {
    if (this.firstInit) {
      this.firstInit = false;
    } else {
      for (let i=0; i<this.resources.length; i++) {
        this.activate(this.resources[i]);
      }
    }
  }
}
