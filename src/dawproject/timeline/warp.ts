import { DoubleAdapter } from "../doubleAdapter";
import type { IWarp } from "../types";
import { Utility } from "../utility";
import { XmlObject } from "../XmlObject";

export class Warp extends XmlObject implements IWarp {
  time: number;
  contentTime: number;

  constructor(time?: number, contentTime?: number) {
    super();
    // Make required fields optional for deserialization, fromXmlObject will set them
    this.time = time || 0; // Provide a default placeholder
    this.contentTime = contentTime || 0; // Provide a default placeholder
  }

  toXmlObject(): any {
    const obj: any = {
      Warp: {},
    };

    // add required attributes
    Utility.addAttribute(obj.Warp, "time", this, {
      required: true,
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Warp, "contentTime", this, {
      required: true,
      adapter: DoubleAdapter.toXml,
    });

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    // validate and populate required attributes
    Utility.populateAttribute<number>(xmlObject, "time", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "contentTime", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });

    return this;
  }
}
