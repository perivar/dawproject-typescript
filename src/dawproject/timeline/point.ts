import { DoubleAdapter } from "../doubleAdapter";
import type { IPoint } from "../types";
import { XmlObject } from "../XmlObject";

export abstract class Point extends XmlObject implements IPoint {
  time: number;

  constructor(time?: number) {
    super();
    // Make time optional for deserialization, fromXmlObject will set it
    this.time = time || 0; // Provide a default placeholder
  }

  toXmlObject(): any {
    // Point is abstract, so it doesn't return a root element itself.
    // Subclasses will wrap these attributes in their specific root tag.
    const attributes: any = {};
    if (this.time !== undefined) {
      attributes["@_time"] = DoubleAdapter.toXml(this.time) || "";
    }
    return attributes;
  }

  fromXmlObject(xmlObject: any): this {
    // validate and populate required time attribute
    if (!xmlObject["@_time"]) {
      throw new Error("Required attribute 'time' missing in XML");
    }
    const timeValue = DoubleAdapter.fromXml(xmlObject["@_time"]);
    if (timeValue === undefined) {
      throw new Error("Invalid time value in XML");
    }
    this.time = timeValue;

    return this;
  }
}
