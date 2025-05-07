import { Referenceable } from "../referenceable";
import { Track } from "../track";
import type { ITimeline, ITrack } from "../types";
import { Utility } from "../utility";
import { TimeUnit } from "./timeUnit";

export abstract class Timeline extends Referenceable implements ITimeline {
  timeUnit?: TimeUnit;
  track?: ITrack;

  constructor(
    track?: ITrack,
    timeUnit?: TimeUnit,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.track = track;
    this.timeUnit = timeUnit;
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Referenceable

    // add optional attributes
    Utility.addAttribute(attributes, "timeUnit", this);
    Utility.addAttribute(attributes, "track", this, {
      sourceProperty: "track.id", // Use the track's ID as reference
    });

    // Since Timeline is abstract, it doesn't return a root element itself.
    // Subclasses will wrap these attributes in their specific root tag.
    return attributes;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Referenceable

    // populate optional attributes
    Utility.populateAttribute<TimeUnit>(xmlObject, "timeUnit", this, {
      castTo: TimeUnit,
    });

    // check if the track ID exists in the XML object
    const trackId = xmlObject["@_track"];
    if (trackId) {
      const track = Referenceable.getById(trackId);
      // check if the retrieved object is a Track before assigning
      if (track instanceof Track) {
        this.track = track;
      } else {
        console.warn(
          `Retrieved object with ID ${trackId} is not a Track and cannot be assigned as a track.`
        );
        this.track = undefined;
      }
    }

    return this;
  }
}
