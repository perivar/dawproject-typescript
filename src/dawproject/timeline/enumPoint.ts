import { registerPoint } from "../registry/pointRegistry";
import type { IEnumPoint } from "../types";
import { Utility } from "../utility";
import { Point } from "./point";

const enumPointFactory = (xmlObject: any): EnumPoint => {
  const instance = new EnumPoint();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerPoint("EnumPoint", enumPointFactory)
export class EnumPoint extends Point implements IEnumPoint {
  value: number;

  constructor(time?: number, value?: number) {
    super(time);
    // Make value optional for deserialization, fromXmlObject will set it
    this.value = value || 0; // Provide a default placeholder
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject();

    // add required value attribute
    Utility.addAttribute(attributes, "value", this, { required: true });

    return { EnumPoint: attributes };
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
