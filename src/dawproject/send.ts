import { Channel } from "./channel";
import { RealParameter } from "./realParameter";
import { Referenceable } from "./referenceable";
import { SendType } from "./sendType";
import { ISend } from "./types";
import { Utility } from "./utility";

/** A single send of a mixer channel. */
export class Send extends Referenceable implements ISend {
  /** Send level. */
  volume?: RealParameter;
  /** Send pan/balance. */
  pan?: RealParameter;
  /** Send type. */
  type?: SendType;
  /** Send destination. */
  destination?: Referenceable;

  constructor(
    volume?: RealParameter,
    pan?: RealParameter,
    type?: SendType,
    destination?: Referenceable,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.volume = volume;
    this.pan = pan;
    this.type = type;
    this.destination = destination;
  }

  toXmlObject(): any {
    const obj: any = {
      Send: {
        ...super.toXmlObject(), // get attributes from Referenceable
      },
    };

    // add optional attributes
    Utility.addAttribute(obj.Send, "type", this);
    Utility.addAttribute(obj.Send, "destination", this, {
      sourceProperty: "destination.id",
    });

    if (this.volume) {
      obj.Send.Volume = this.volume.toXmlObject().RealParameter;
    }
    if (this.pan) {
      obj.Send.Pan = this.pan.toXmlObject().RealParameter;
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Referenceable

    // handle optional attributes
    Utility.populateAttribute<SendType>(xmlObject, "type", this, {
      castTo: SendType,
    });

    // read destination ID and look it up in the Referenceable registry
    const destinationId = xmlObject["@_destination"];
    if (destinationId) {
      const destination = Referenceable.getById(destinationId);
      // Check if the retrieved object is a Channel before assigning
      if (destination instanceof Channel) {
        this.destination = destination;
      } else {
        console.warn(
          `Retrieved object with ID ${destinationId} is not a Channel and cannot be assigned as a destination.`
        );
        this.destination = undefined; // Ensure destination is undefined if not a Channel
      }
    }

    if (xmlObject.Volume) {
      this.volume = new RealParameter().fromXmlObject(xmlObject.Volume);
    }

    if (xmlObject.Pan) {
      this.pan = new RealParameter().fromXmlObject(xmlObject.Pan);
    }

    return this;
  }
}
