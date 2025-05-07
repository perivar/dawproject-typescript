import { registerPoint } from "../registry/pointRegistry";
import type { ITimeSignaturePoint } from "../types";
import { Utility } from "../utility";
import { Point } from "./point";

const timeSignaturePointFactory = (xmlObject: any): TimeSignaturePoint => {
  const instance = new TimeSignaturePoint();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerPoint("TimeSignaturePoint", timeSignaturePointFactory)
export class TimeSignaturePoint extends Point implements ITimeSignaturePoint {
  numerator: number;
  denominator: number;

  constructor(time?: number, numerator?: number, denominator?: number) {
    super(time); // time is now optional in Point
    // Make numerator and denominator optional for deserialization, fromXmlObject will set them
    this.numerator = numerator || 0; // Provide a default placeholder
    this.denominator = denominator || 0; // Provide a default placeholder
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Point

    // Add required numerator attribute
    Utility.addAttribute(attributes, "numerator", this, { required: true });

    // Add required denominator attribute
    Utility.addAttribute(attributes, "denominator", this, { required: true });

    return { TimeSignaturePoint: attributes };
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    // validate and populate required numerator attribute
    Utility.populateAttribute<number>(xmlObject, "numerator", this, {
      required: true,
      castTo: Number,
    });

    // validate and populate required denominator attribute
    Utility.populateAttribute<number>(xmlObject, "denominator", this, {
      required: true,
      castTo: Number,
    });

    return this;
  }
}
