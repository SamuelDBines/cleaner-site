import * as Decorators from "@/packages/decorators/ModelDecorator";

@Decorators.Table()
export class User {
  name: string;
  private test = false;
  constructor() {
    // this.name = name;
  }

  method() {
    return this.name;
  }
}