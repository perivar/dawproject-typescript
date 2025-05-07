import { DoubleAdapter } from "./doubleAdapter";
import { Parameter } from "./parameter";
import { IRealParameter } from "./types";
import { Unit } from "./unit";
import { Utility } from "./utility";

/** Represents a real valued (double) parameter which can provide a value and be used as an automation target. */
export class RealParameter extends Parameter implements IRealParameter {
  /** Real (double) value for this parameter.
   * <p>When serializing value to text for XML, infinite values are allowed and should be represented as inf and -inf. </p>*/
  value?: number;
  /** Unit in which value, min and max are defined.
   * <p>Using this rather than normalized value ranges allows transfer of parameter values and automation data.</p> */
  unit?: Unit;
  /** Minimum value this parameter can have (inclusive). */
  min?: number;
  /** Maximum value this parameter can have (inclusive). */
  max?: number;

  constructor(
    value?: number,
    unit?: Unit,
    min?: number,
    max?: number,
    parameterID?: number,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(parameterID, name, color, comment);
    this.value = value;
    this.unit = unit;
    this.min = min;
    this.max = max;
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Parameter

    // add optional attributes
    Utility.addAttribute(attributes, "value", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(attributes, "unit", this);
    Utility.addAttribute(attributes, "min", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(attributes, "max", this, {
      adapter: DoubleAdapter.toXml,
    });

    return { RealParameter: attributes };
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Parameter

    // populate optional attributes
    Utility.populateAttribute<number>(xmlObject, "value", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<Unit>(xmlObject, "unit", this, { castTo: Unit });
    Utility.populateAttribute<number>(xmlObject, "min", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "max", this, {
      adapter: DoubleAdapter.fromXml,
    });

    return this;
  }
}
