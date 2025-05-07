import { registerPoint } from "../registry/pointRegistry";
import type { IIntegerPoint } from "../types";
import { Utility } from "../utility";
import { Point } from "./point";

const integerPointFactory = (xmlObject: any): IntegerPoint => {
  const instance = new IntegerPoint();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerPoint("IntegerPoint", integerPointFactory)
export class IntegerPoint extends Point implements IIntegerPoint {
  value: number;

  constructor(time?: number, value?: number) {
    super(time); // time is now optional in Point
    // Make value optional for deserialization, fromXmlObject will set it
    this.value = value || 0; // Provide a default placeholder
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject();

    // add required value attribute
    Utility.addAttribute(attributes, "value", this, { required: true });

    return { IntegerPoint: attributes };
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    // validate and populate required value attribute
    Utility.populateAttribute<number>(xmlObject, "value", this, {
      required: true,
      castTo: Number,
    });

    return this;
  }
}
