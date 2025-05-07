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

    this.lanes = []; // Initialize the lanes array

    // start the recursive processing
    this._processNestedTimelines(xmlObject);

    return this;
  }

  private _processNestedTimelines(xmlObject: any): void {
    if (!xmlObject || typeof xmlObject !== "object") {
      return; // Stop recursion if not an object
    }

    for (const tagName in xmlObject) {
      // Skip attributes (those starting with @_)
      if (tagName.startsWith("@_")) continue;

      const elementData = xmlObject[tagName];

      if (Array.isArray(elementData)) {
        // If it's an array, iterate through the array
        for (const item of elementData) {
          // Attempt to create a timeline instance for the item
          const timelineInstance = TimelineRegistry.createTimelineFromXml(
            tagName, // Use the tag name for the type
            item // Pass the individual item object
          );

          if (timelineInstance) {
            this.lanes.push(timelineInstance);
          } else if (typeof item === "object" && item !== null) {
            // If createTimelineFromXml failed and the item is an object,
            // recursively process its children. This handles nested structures within arrays.
            this._processNestedTimelines(item);
          } else {
            console.warn(
              `Skipping deserialization of unknown nested timeline element: ${tagName}`
            );
          }
        }
      } else if (typeof elementData === "object" && elementData !== null) {
        // If it's a single object
        // Attempt to create a timeline instance for the object
        const timelineInstance = TimelineRegistry.createTimelineFromXml(
          tagName,
          elementData
        );

        if (timelineInstance) {
          this.lanes.push(timelineInstance);
        } else {
          // If createTimelineFromXml failed, recursively process its children
          this._processNestedTimelines(elementData);
        }
      }
      // If elementData is a primitive, it's likely an attribute or text content, skip.
    }
  }
}
