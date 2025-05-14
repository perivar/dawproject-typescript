import { DoubleAdapter } from "../doubleAdapter";
import { Nameable } from "../nameable";
import { TimelineRegistry } from "../registry/timelineRegistry";
import type { IClip } from "../types";
import { Utility } from "../utility";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";

export class Clip extends Nameable implements IClip {
  time: number;
  duration?: number;
  contentTimeUnit?: TimeUnit;
  playStart?: number;
  playStop?: number;
  loopStart?: number;
  loopEnd?: number;
  fadeTimeUnit?: TimeUnit;
  fadeInTime?: number;
  fadeOutTime?: number;
  content?: Timeline;
  reference?: string;

  constructor(
    // Make time optional for deserialization, fromXmlObject will set it
    time?: number,
    duration?: number,
    contentTimeUnit?: TimeUnit,
    playStart?: number,
    playStop?: number,
    loopStart?: number,
    loopEnd?: number,
    fadeTimeUnit?: TimeUnit,
    fadeInTime?: number,
    fadeOutTime?: number,
    content?: Timeline,
    reference?: string, // Change type to string | undefined
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.time = time || 0; // Provide a default placeholder
    this.duration = duration;
    this.contentTimeUnit = contentTimeUnit;
    this.playStart = playStart;
    this.playStop = playStop;
    this.loopStart = loopStart;
    this.loopEnd = loopEnd;
    this.fadeTimeUnit = fadeTimeUnit;
    this.fadeInTime = fadeInTime;
    this.fadeOutTime = fadeOutTime;
    this.content = content;
    this.reference = reference; // Assign string directly
  }

  toXmlObject(): any {
    const obj: any = {
      Clip: {
        ...super.toXmlObject(), // get attributes from Nameable
      },
    };

    // add required attribute
    Utility.addAttribute(obj.Clip, "time", this, {
      adapter: DoubleAdapter.toXml,
    });

    // add optional attributes
    Utility.addAttribute(obj.Clip, "duration", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Clip, "contentTimeUnit", this);
    Utility.addAttribute(obj.Clip, "playStart", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Clip, "playStop", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Clip, "loopStart", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Clip, "loopEnd", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Clip, "fadeTimeUnit", this);
    Utility.addAttribute(obj.Clip, "fadeInTime", this, {
      adapter: DoubleAdapter.toXml,
    });
    Utility.addAttribute(obj.Clip, "fadeOutTime", this, {
      adapter: DoubleAdapter.toXml,
    });

    // Append content if present
    if (this.content !== undefined) {
      const contentObj = this.content.toXmlObject();
      const tagName = Object.keys(contentObj)[0];
      obj.Clip[tagName] = contentObj[tagName];
    }

    // Reference handling
    Utility.addAttribute(obj.Clip, "reference", this);

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    // validate and populate required attribute
    Utility.populateAttribute<number>(xmlObject, "time", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });

    // populate optional attributes
    Utility.populateAttribute<number>(xmlObject, "duration", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<TimeUnit>(xmlObject, "contentTimeUnit", this, {
      castTo: TimeUnit,
    });
    Utility.populateAttribute<number>(xmlObject, "playStart", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "playStop", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "loopStart", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "loopEnd", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<TimeUnit>(xmlObject, "fadeTimeUnit", this, {
      castTo: TimeUnit,
    });
    Utility.populateAttribute<number>(xmlObject, "fadeInTime", this, {
      adapter: DoubleAdapter.fromXml,
    });
    Utility.populateAttribute<number>(xmlObject, "fadeOutTime", this, {
      adapter: DoubleAdapter.fromXml,
    });

    // Iterate through all properties in xmlObject to find timeline elements
    for (const tagName in xmlObject) {
      // Skip attributes (those starting with @_)
      if (tagName.startsWith("@_")) continue;

      const elementData = xmlObject[tagName];
      const elementArray = Array.isArray(elementData)
        ? elementData
        : [elementData];

      elementArray.forEach((item: any) => {
        // Use TimelineRegistry to create timeline instances
        const timelineInstance = TimelineRegistry.createTimelineFromXml(
          tagName,
          item
        );

        if (timelineInstance instanceof Timeline) {
          this.content = timelineInstance;
        } else if (timelineInstance) {
          console.warn(
            `TimelineRegistry returned non-Timeline instance for tag ${tagName}`
          );
        } else {
          console.warn(
            `Skipping deserialization of unknown nested timeline content in Clip: ${tagName}`
          );
        }
      });
    }

    Utility.populateAttribute<string>(xmlObject, "reference", this);

    return this;
  }
}
