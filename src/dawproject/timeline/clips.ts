import { registerTimeline } from "../registry/timelineRegistry";
import type { IClips, ITrack } from "../types";
import { Clip } from "./clip";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";

const clipsFactory = (xmlObject: any): Clips => {
  const instance = new Clips();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("Clips", clipsFactory)
export class Clips extends Timeline implements IClips {
  clips: Clip[];

  constructor(
    clips?: Clip[],
    track?: ITrack,
    timeUnit?: TimeUnit,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(track, timeUnit, name, color, comment);
    this.clips = clips || [];
  }

  toXmlObject(): any {
    const obj: any = {
      Clips: {
        ...super.toXmlObject(), // get attributes from Timeline
      },
    };

    // Append child elements for each clip
    if (this.clips && this.clips.length > 0) {
      obj.Clips.Clip = this.clips.map(clip => clip.toXmlObject().Clip);
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    // Process child elements of type Clip
    const clips: Clip[] = [];
    if (xmlObject.Clip) {
      const clipArray = Array.isArray(xmlObject.Clip)
        ? xmlObject.Clip
        : [xmlObject.Clip];
      clipArray.forEach((clipObj: any) => {
        clips.push(new Clip().fromXmlObject(clipObj));
      });
    }
    this.clips = clips;

    return this;
  }
}
