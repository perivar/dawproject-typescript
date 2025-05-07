import { registerPoint } from "../registry/pointRegistry";
import type { IBoolPoint } from "../types";
import { Utility } from "../utility";
import { Point } from "./point";

const boolPointFactory = (xmlObject: any): BoolPoint => {
  const instance = new BoolPoint();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerPoint("BoolPoint", boolPointFactory)
export class BoolPoint extends Point implements IBoolPoint {
  value: boolean;

  constructor(time?: number, value?: boolean) {
    super(time); // time is now optional in Point
    // Make value optional for deserialization, fromXmlObject will set it
    this.value = value || false; // Provide a default placeholder
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Point

    // add required value attribute
    Utility.addAttribute(attributes, "value", this, { required: true });

    return { BoolPoint: attributes };
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    // validate and populate required value attribute
    Utility.populateAttribute<boolean>(xmlObject, "value", this, {
      required: true,
      castTo: Boolean,
    });

    return this;
  }
}
