import { DoubleAdapter } from "../doubleAdapter";
import { TimelineRegistry } from "../registry/timelineRegistry";
import type { INote } from "../types";
import { Utility } from "../utility";
import { XmlObject } from "../XmlObject";
import { Timeline } from "./timeline";

export class Note extends XmlObject implements INote {
  time: number;
  duration: number;
  key: number;
  channel?: number;
  velocity?: number;
  releaseVelocity?: number;
  content?: Timeline;

  constructor(
    // Make required fields optional for deserialization, provide defaults
    time?: number,
    duration?: number,
    key?: number,
    channel: number = 0,
    velocity?: number,
    releaseVelocity?: number,
    content?: Timeline
  ) {
    super();
    // Provide default placeholders for required fields
    this.time = time || 0;
    this.duration = duration || 0;
    this.key = key || 0;
    this.channel = channel;
    this.velocity = velocity;
    this.releaseVelocity = releaseVelocity;
    this.content = content;
  }

  toXmlObject(): any {
    const obj: any = {
      Note: {},
    };

    // add required attributes
    Utility.addAttribute(obj.Note, "time", this, {
      required: true,
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Note, "duration", this, {
      required: true,
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Note, "key", this, { required: true });

    // add optional attributes
    Utility.addAttribute(obj.Note, "channel", this);
    Utility.addAttribute(obj.Note, "vel", this, {
      sourceProperty: "velocity",
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Note, "rel", this, {
      sourceProperty: "releaseVelocity",
      adapter: DoubleAdapter.toXml,
    });

    if (this.content !== undefined) {
      const contentObj = this.content.toXmlObject();
      const tagName = Object.keys(contentObj)[0];
      obj.Note.Content = { [tagName]: contentObj[tagName] }; // Wrap in "Content" tag
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    // validate and populate required attributes
    Utility.populateAttribute<number>(xmlObject, "time", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "duration", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "key", this, {
      required: true,
      castTo: Number,
    });

    // populate optional attributes
    Utility.populateAttribute<number>(xmlObject, "channel", this, {
      castTo: Number,
    });
    Utility.populateAttribute<number | undefined>(xmlObject, "vel", this, {
      targetProperty: "velocity",
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number | undefined>(xmlObject, "rel", this, {
      targetProperty: "releaseVelocity",
      adapter: DoubleAdapter.fromXml,
    });

    // Handle content if present
    if (xmlObject.Content) {
      const contentObj = xmlObject.Content;
      const tagName = Object.keys(contentObj)[0]; // Get the actual content tag name
      const TimelineClass = TimelineRegistry.getTimelineClass(tagName);

      if (TimelineClass) {
        try {
          this.content = new TimelineClass().fromXmlObject(contentObj[tagName]);
        } catch (e) {
          console.error(
            `Error deserializing nested timeline content ${tagName} in Note:`,
            e
          );
        }
      } else {
        console.warn(
          `Skipping deserialization of unknown nested timeline content in Note: ${tagName}`
        );
      }
    }

    return this;
  }
}
