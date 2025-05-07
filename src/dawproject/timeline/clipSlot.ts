import { registerTimeline } from "../registry/timelineRegistry";
import type { IClipSlot, ITrack } from "../types";
import { Utility } from "../utility";
import { Clip } from "./clip";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";

const clipSlotFactory = (xmlObject: any): ClipSlot => {
  const instance = new ClipSlot();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("ClipSlot", clipSlotFactory)
export class ClipSlot extends Timeline implements IClipSlot {
  clip?: Clip;
  hasStop?: boolean;

  constructor(
    clip?: Clip,
    hasStop?: boolean,
    track?: ITrack,
    timeUnit?: TimeUnit,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(track, timeUnit, name, color, comment);
    this.clip = clip;
    this.hasStop = hasStop;
  }

  toXmlObject(): any {
    const obj: any = {
      ClipSlot: {
        ...super.toXmlObject(), // populate inherited attributes from Timeline
      },
    };

    if (this.clip) {
      obj.ClipSlot.Clip = this.clip.toXmlObject().Clip;
    }

    // add optional attribute
    Utility.addAttribute(obj.ClipSlot, "hasStop", this);

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    if (xmlObject.Clip) {
      this.clip = new Clip().fromXmlObject(xmlObject.Clip);
    }

    // populate optional attribute
    Utility.populateAttribute<boolean>(xmlObject, "hasStop", this, {
      castTo: Boolean,
    });

    return this;
  }
}
