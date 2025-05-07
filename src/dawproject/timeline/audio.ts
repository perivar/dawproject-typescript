import { FileReference } from "../fileReference";
import { registerTimeline } from "../registry/timelineRegistry";
import type { IAudio, IFileReference } from "../types"; // Import IFileReference
import { Utility } from "../utility";
import { MediaFile } from "./mediaFile";
import { TimeUnit } from "./timeUnit";

const audioFactory = (xmlObject: any): Audio => {
  const instance = new Audio();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("Audio", audioFactory)
export class Audio extends MediaFile implements IAudio {
  sampleRate: number;
  channels: number;
  algorithm?: string;

  constructor(
    // Make required fields optional for deserialization, provide defaults
    sampleRate?: number,
    channels?: number,
    duration?: number,
    file?: IFileReference,
    algorithm?: string,
    name?: string,
    timeUnit?: TimeUnit
  ) {
    // Provide default placeholders for required fields
    super(file || new FileReference(""), duration || 0, name, timeUnit);
    this.sampleRate = sampleRate || 0; // Default placeholder
    this.channels = channels || 0; // Default placeholder
    this.algorithm = algorithm;
  }

  toXmlObject(): any {
    const obj: any = {
      Audio: {
        ...super.toXmlObject(), // get attributes and children from MediaFile's toXmlObject
      },
    };

    // add required attributes
    Utility.addAttribute(obj.Audio, "sampleRate", this, {
      required: true,
    });
    Utility.addAttribute(obj.Audio, "channels", this, {
      required: true,
    });

    // add optional attribute
    Utility.addAttribute(obj.Audio, "algorithm", this);

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    // validate and populate required attributes
    Utility.populateAttribute<number>(xmlObject, "sampleRate", this, {
      required: true,
      castTo: Number,
    });
    Utility.populateAttribute<number>(xmlObject, "channels", this, {
      required: true,
      castTo: Number,
    });

    // populate optional attribute
    Utility.populateAttribute(xmlObject, "algorithm", this);

    return this;
  }
}
