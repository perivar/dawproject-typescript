import {
  registerTimeline,
  TimelineRegistry,
} from "../registry/timelineRegistry";
import type { ITrack, IWarps } from "../types";
import { Utility } from "../utility";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";
import { Warp } from "./warp";

const warpsFactory = (xmlObject: any): Warps => {
  const instance = new Warps();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("Warps", warpsFactory)
export class Warps extends Timeline implements IWarps {
  contentTimeUnit: TimeUnit;
  points: Warp[];
  content?: Timeline;

  constructor(
    // Make required fields optional for deserialization, provide defaults
    points?: Warp[],
    contentTimeUnit?: TimeUnit,
    content?: Timeline,
    track?: ITrack,
    timeUnit?: TimeUnit,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(track, timeUnit, name, color, comment); // Pass relevant args to Timeline constructor
    // Provide default placeholders for required fields
    this.points = points || [];
    this.content = content;
    this.contentTimeUnit = contentTimeUnit || TimeUnit.BEATS; // Default placeholder
  }

  toXmlObject(): any {
    const obj: any = {
      Warps: {
        ...super.toXmlObject(), // populate inherited attributes from Timeline
      },
    };

    // add required attribute
    Utility.addAttribute(obj.Warps, "contentTimeUnit", this, {
      required: true,
    });

    // append the nested content (e.g., another Timeline)
    if (this.content) {
      const contentObj = this.content.toXmlObject();
      const tagName = Object.keys(contentObj)[0];
      obj.Warps.Content = { [tagName]: contentObj[tagName] }; // Wrap in "Content" tag
    }

    // recursively add nested Warp elements
    if (this.points && this.points.length > 0) {
      obj.Warps.Warp = this.points.map(warp => warp.toXmlObject().Warp);
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Timeline

    // validate and populate required attribute
    Utility.populateAttribute<TimeUnit>(xmlObject, "contentTimeUnit", this, {
      required: true,
      castTo: TimeUnit,
    });

    // handle content if present
    let content: Timeline | undefined;
    if (xmlObject.Content) {
      const contentObj = xmlObject.Content;
      const tagName = Object.keys(contentObj)[0]; // Get the actual content tag name

      content = TimelineRegistry.createTimelineFromXml(
        tagName,
        contentObj[tagName]
      );
      if (!content) {
        console.warn(
          `Skipping deserialization of unknown nested timeline content in Warps: ${tagName}`
        );
      }
    }
    this.content = content;

    // recursively parse nested Warp elements
    const points: Warp[] = []; // Renamed from events
    if (xmlObject.Warp) {
      const warpArray = Array.isArray(xmlObject.Warp)
        ? xmlObject.Warp
        : [xmlObject.Warp];
      warpArray.forEach((warpObj: any) => {
        points.push(new Warp().fromXmlObject(warpObj));
      });
    }
    this.points = points;

    return this;
  }
}
