import { Parameter } from "./parameter";
import { IBoolParameter } from "./types";
import { Utility } from "./utility";

/** Represents a parameter which can provide a boolean (true/false) value and be used as an automation target. */
export class BoolParameter extends Parameter implements IBoolParameter {
  /** Boolean value for this parameter. */
  value?: boolean;

  constructor(
    value?: boolean,
    parameterID?: number,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(parameterID, name, color, comment);
    this.value = value;
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Parameter

    // add optional attribute
    Utility.addAttribute(attributes, "value", this);

    // Return with proper structure
    return {
      BoolParameter: {
        ...attributes,
      },
    };
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Parameter

    // populate optional attribute
    Utility.populateAttribute<boolean>(xmlObject, "value", this, {
      castTo: Boolean,
    });

    return this;
  }
}
