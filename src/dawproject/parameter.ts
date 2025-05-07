import { Referenceable } from "./referenceable";
import { IParameter } from "./types";
import { Utility } from "./utility";

/** Represents a parameter which can provide a value and be used as an automation target. */
export abstract class Parameter extends Referenceable implements IParameter {
  /** Parameter ID as used by VST2 (index), VST3(ParamID) */
  parameterID?: number;

  constructor(
    parameterID?: number,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.parameterID = parameterID;
  }

  protected getXmlAttributes(): any {
    const attributes = super.toXmlObject(); // Get inherited attributes first

    // add optional attribute
    Utility.addAttribute(attributes, "parameterID", this);

    return attributes;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Referenceable

    // populate optional attribute
    Utility.populateAttribute<number>(xmlObject, "parameterID", this, {
      castTo: Number,
    });

    return this;
  }
}
