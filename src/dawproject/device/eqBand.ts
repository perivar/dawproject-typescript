import { BoolParameter } from "../boolParameter";
import { RealParameter } from "../realParameter";
import type { IEqBand } from "../types";
import { Unit } from "../unit";
import { Utility } from "../utility";
import { XmlObject } from "../XmlObject";
import { EqBandType } from "./eqBandType";

export class EqBand extends XmlObject implements IEqBand {
  freq: RealParameter;
  gain?: RealParameter;
  q?: RealParameter;
  enabled?: BoolParameter;
  type: EqBandType;
  order?: number;

  constructor(
    // Make required fields optional for deserialization, provide defaults
    type?: EqBandType,
    freq?: RealParameter,
    gain?: RealParameter,
    q?: RealParameter,
    enabled?: BoolParameter,
    order?: number
  ) {
    super();
    // Provide default placeholders for required fields
    this.type = type || EqBandType.BELL; // Default placeholder
    this.freq = freq || new RealParameter(0, Unit.HERTZ); // Default placeholder
    this.gain = gain;
    this.q = q;
    this.enabled = enabled;
    this.order = order;
  }

  toXmlObject(): any {
    const obj: any = {
      Band: {},
    };

    // add required attribute
    Utility.addAttribute(obj.Band, "type", this, {
      required: true,
    });

    // add optional attribute
    Utility.addAttribute(obj.Band, "order", this);

    if (this.freq) {
      obj.Band.Freq = this.freq.toXmlObject().RealParameter;
    } else {
      throw new Error("Required attribute 'freq' missing for EqBand");
    }

    if (this.gain) {
      obj.Band.Gain = this.gain.toXmlObject().RealParameter;
    }

    if (this.q) {
      obj.Band.Q = this.q.toXmlObject().RealParameter;
    }

    if (this.enabled) {
      obj.Band.Enabled = this.enabled.toXmlObject().BoolParameter;
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    // validate and populate required attribute
    Utility.populateAttribute<EqBandType>(xmlObject, "type", this, {
      required: true,
      castTo: EqBandType,
    });

    // populate optional attribute
    Utility.populateAttribute<number>(xmlObject, "order", this, {
      castTo: Number,
    });

    if (xmlObject.Freq) {
      this.freq = new RealParameter().fromXmlObject(xmlObject.Freq);
    } else {
      throw new Error("Required element 'Freq' missing in XML");
    }

    if (xmlObject.Gain) {
      this.gain = new RealParameter().fromXmlObject(xmlObject.Gain);
    }

    if (xmlObject.Q) {
      this.q = new RealParameter().fromXmlObject(xmlObject.Q);
    }

    if (xmlObject.Enabled) {
      this.enabled = new BoolParameter().fromXmlObject(xmlObject.Enabled);
    }

    return this;
  }
}
