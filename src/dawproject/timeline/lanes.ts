import {
  registerTimeline,
  TimelineRegistry,
} from "../registry/timelineRegistry";
import type { ILanes, ITrack } from "../types";
import { Utility } from "../utility";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";

const lanesFactory = (xmlObject: any): Lanes => {
  const instance = new Lanes();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("Lanes", lanesFactory)
export class Lanes extends Timeline implements ILanes {
  lanes: Timeline[];

  constructor(
    lanes?: Timeline[],
    track?: ITrack,
    timeUnit?: TimeUnit,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(track, timeUnit, name, color, comment);
    this.lanes = lanes || [];
  }

  toXmlObject(): any {
    const obj: any = {
      Lanes: {
        ...super.toXmlObject(), // get attributes from Timeline
      },
    };

    // append child elements for each lane
    const groupedLanes = Utility.groupChildrenByTagName(this.lanes);
    if (groupedLanes) {
      obj.Lanes = {
        ...obj.Lanes, // keep existing attributes
        ...groupedLanes,
      };
    }

    return obj;
  }

  override fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Timeline

    // Process child elements of type Lanes and its subclasses using the registry
    this.lanes = []; // Initialize the lanes array

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
          this.lanes.push(timelineInstance);
        } else if (timelineInstance) {
          console.warn(
            `TimelineRegistry returned non-Timeline instance for tag ${tagName}`
          );
        } else {
          console.warn(
            `Skipping deserialization of unknown nested timeline element: ${tagName}`
          );
        }
      });
    }

    return this;
  }
}
