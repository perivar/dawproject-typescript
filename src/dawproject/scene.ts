import { Referenceable } from "./referenceable";
import { TimelineRegistry } from "./registry/timelineRegistry";
import { Timeline } from "./timeline/timeline";
import { IScene } from "./types";

/** Represents a clip launcher Scene of a DAW. */
export class Scene extends Referenceable implements IScene {
  /** Content timeline of this scene, will typically be structured like this:
   * <pre>{@code
   * <Scene>
   *   <Lanes>
   *     <ClipSlot track="...">
   *        <Clip>
   *           ...
   *        </Clip>
   *     </ClipSlot>
   *      ...
   *   </Lanes>
   * </Scene>
   * }</pre>
   * */
  content?: Timeline;

  constructor(
    content?: Timeline,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.content = content;
  }

  toXmlObject(): any {
    const obj: any = {
      Scene: {
        ...super.toXmlObject(), // get attributes from Referenceable
      },
    };

    if (this.content) {
      const contentObj = this.content.toXmlObject();
      const tagName = Object.keys(contentObj)[0];
      obj.Scene.Content = { [tagName]: contentObj[tagName] }; // wrap in "Content" tag
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Referenceable

    // handle content if present
    let content: Timeline | undefined;
    if (xmlObject.Content) {
      const contentObj = xmlObject.Content;
      const tagName = Object.keys(contentObj)[0]; // Get the actual content tag name
      const TimelineClass = TimelineRegistry.getTimelineClass(tagName);

      if (TimelineClass) {
        try {
          const timelineInstance = TimelineRegistry.createTimelineFromXml(
            tagName,
            contentObj[tagName]
          );
          if (timelineInstance) {
            content = timelineInstance;
          } else {
            console.warn(
              `Skipping deserialization of unknown nested timeline content in Scene: ${tagName}`
            );
          }
        } catch (e) {
          console.error(
            `Error deserializing nested timeline content ${tagName} in Scene:`,
            e
          );
        }
      } else {
        console.warn(
          `Skipping deserialization of unknown nested timeline content in Scene: ${tagName}`
        );
      }
    }
    this.content = content;

    return this;
  }
}
