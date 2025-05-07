import { Parameter } from "./parameter";
import { ITimeSignatureParameter } from "./types";
import { Utility } from "./utility";

/** Represents a (the) time-signature parameter which can provide a value and be used as an automation target. */
export class TimeSignatureParameter
  extends Parameter
  implements ITimeSignatureParameter
{
  /** Numerator of the time-signature. (3/4 → 3, 4/4 → 4)*/
  numerator: number;
  /** Denominator of the time-signature. (3/4 → 4, 7/8 → 8) */
  denominator: number;

  constructor(
    numerator?: number,
    denominator?: number,
    parameterID?: number,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(parameterID, name, color, comment);
    // Make numerator and denominator optional for deserialization, fromXmlObject will set it
    this.numerator = numerator || 4; // Default to 4
    this.denominator = denominator || 4; // Default to 4
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Parameter

    // add required attributes
    Utility.addAttribute(attributes, "numerator", this, {
      required: true,
    });
    Utility.addAttribute(attributes, "denominator", this, {
      required: true,
    });

    return { TimeSignatureParameter: attributes };
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Parameter

    // validate and populate required attributes
    Utility.populateAttribute<number>(xmlObject, "numerator", this, {
      required: true,
      castTo: Number,
    });
    Utility.populateAttribute<number>(xmlObject, "denominator", this, {
      required: true,
      castTo: Number,
    });

    return this;
  }
}
