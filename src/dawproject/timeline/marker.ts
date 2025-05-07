import { DoubleAdapter } from "../doubleAdapter";
import { Nameable } from "../nameable";
import type { IMarker } from "../types";
import { Utility } from "../utility";

export class Marker extends Nameable implements IMarker {
  time: number;

  constructor(time?: number, name?: string, color?: string, comment?: string) {
    super(name, color, comment);
    // Make time optional for deserialization, fromXmlObject will set it
    this.time = time || 0; // Provide a default placeholder
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Nameable

    // add required time attribute
    Utility.addAttribute(attributes, "time", this, {
      required: true,
      adapter: DoubleAdapter.toXml,
    });

    return attributes;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Nameable

    // validate and populate required time attribute
    Utility.populateAttribute<number>(xmlObject, "time", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });

    return this;
  }
}
