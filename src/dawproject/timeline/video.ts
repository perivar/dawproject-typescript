import { FileReference } from "../fileReference";
import { registerTimeline } from "../registry/timelineRegistry";
import type { IFileReference, IVideo } from "../types"; // Import IFileReference
import { Utility } from "../utility";
import { MediaFile } from "./mediaFile";
import { TimeUnit } from "./timeUnit";

const videoFactory = (xmlObject: any): Video => {
  const instance = new Video();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("Video", videoFactory)
export class Video extends MediaFile implements IVideo {
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
      Video: {
        ...super.toXmlObject(), // get attributes and children from MediaFile's toXmlObject
      },
    };

    // add required attributes
    Utility.addAttribute(obj.Video, "sampleRate", this, { required: true });
    Utility.addAttribute(obj.Video, "channels", this, { required: true });

    // add optional attribute
    Utility.addAttribute(obj.Video, "algorithm", this);

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
    Utility.populateAttribute<string>(xmlObject, "algorithm", this);

    return this;
  }
}
