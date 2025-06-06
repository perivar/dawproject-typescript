import { PointRegistry } from "../registry/pointRegistry";
import { registerTimeline } from "../registry/timelineRegistry";
import type { IPoints, ITrack } from "../types";
import { Unit } from "../unit";
import { AutomationTarget } from "./automationTarget";
import { Utility } from "../utility"; // Import Utility
import { Point } from "./point";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";

const pointsFactory = (xmlObject: any): Points => {
  const instance = new Points();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("Points", pointsFactory)
export class Points extends Timeline implements IPoints {
  target: AutomationTarget;
  points: Point[];
  unit?: Unit;

  constructor(
    target?: AutomationTarget,
    points?: Point[],
    unit?: Unit,
    track?: ITrack,
    timeUnit?: TimeUnit,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(track, timeUnit, name, color, comment);
    this.target = target || new AutomationTarget();
    this.points = points || [];
    this.unit = unit;
  }

  toXmlObject(): any {
    const obj: any = {
      Points: {
        ...super.toXmlObject(), // get attributes from Timeline
      },
    };

    // Append Target element with parameter attribute
    if (this.target && this.target.parameter) {
      obj.Points.Target = { "@_parameter": this.target.parameter.id };
    }

    // Append child elements for each point
    if (this.points && this.points.length > 0) {
      // Iterate through points and add their XML objects directly to Points
      this.points.forEach(point => {
        const pointXmlObject = point.toXmlObject();
        // pointXmlObject is expected to be like { RealPoint: { ...attributes } }
        // Get the tag name (e.g., "RealPoint")
        const tagName = Object.keys(pointXmlObject)[0];
        if (tagName) {
          // Add the point's XML object directly under the Points element
          // Handle multiple points of the same type by creating an array if necessary
          if (obj.Points[tagName]) {
            if (!Array.isArray(obj.Points[tagName])) {
              obj.Points[tagName] = [obj.Points[tagName]];
            }
            obj.Points[tagName].push(pointXmlObject[tagName]);
          } else {
            obj.Points[tagName] = pointXmlObject[tagName];
          }
        }
      });
    }

    if (this.unit !== undefined) {
      obj.Points["@_unit"] = this.unit;
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Timeline

    // Process Target element
    if (xmlObject.Target) {
      this.target = new AutomationTarget().fromXmlObject(xmlObject.Target);
    }

    // Process child elements of type Point and its subclasses using the registry
    this.points = []; // Initialize the points array
    Utility.populateChildrenFromXml<Point>(
      xmlObject,
      "points",
      this,
      {
        createFromXml: (tagName: string, xmlData: any) =>
          PointRegistry.createPointFromXml(tagName, xmlData),
      },
      {
        skipTags: ["Target"], // Skip the Target element
        onError: (error: unknown, tagName: string) => {
          console.error(
            `Error deserializing nested point element ${tagName} in Points:`,
            error
          );
        },
      }
    );

    if (xmlObject["@_unit"] !== undefined) {
      this.unit = xmlObject["@_unit"] as Unit; // Cast string to Unit
    }

    return this;
  }
}
