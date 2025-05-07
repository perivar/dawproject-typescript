import { DoubleAdapter } from "../doubleAdapter";
import { Interpolation } from "../interpolation";
import { registerPoint } from "../registry/pointRegistry";
import type { IRealPoint } from "../types";
import { Utility } from "../utility";
import { Point } from "./point";

const realPointFactory = (xmlObject: any): RealPoint => {
  const instance = new RealPoint();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerPoint("RealPoint", realPointFactory)
export class RealPoint extends Point implements IRealPoint {
  value: number;
  interpolation?: Interpolation;

  constructor(time?: number, value?: number, interpolation?: Interpolation) {
    super(time); // time is now optional in Point
    // Make value optional for deserialization, fromXmlObject will set it
    this.value = value || 0; // Provide a default placeholder
    this.interpolation = interpolation;
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Point

    // add required value attribute
    Utility.addAttribute(attributes, "value", this, {
      required: true,
      adapter: DoubleAdapter.toXml,
    });

    // Add optional interpolation attribute
    Utility.addAttribute(attributes, "interpolation", this);

    return { RealPoint: attributes };
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Point

    // validate and populate required value attribute
    Utility.populateAttribute<number>(xmlObject, "value", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });

    // Populate optional interpolation attribute
    Utility.populateAttribute<Interpolation>(xmlObject, "interpolation", this, {
      castTo: Interpolation,
    });

    return this;
  }
}
