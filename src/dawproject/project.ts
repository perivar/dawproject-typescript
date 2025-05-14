import { Application } from "./application";
import { Arrangement } from "./arrangement";
import { Lane } from "./lane";
import { LaneRegistry } from "./registry/laneRegistry";
import { Scene } from "./scene";
import { Transport } from "./transport";
import { IProject } from "./types";
import { Utility } from "./utility";
import { XmlObject } from "./XmlObject";

/** The main root element of the DAWPROJECT format. This is stored in the file project.xml file inside the container. */
export class Project extends XmlObject implements IProject {
  static CURRENT_VERSION = "1.0";

  /** Version of DAWPROJECT format this file was saved as. */
  version: string;
  /** Metadata (name/version) about the application that saved this file. */
  application: Application;
  /** Transport element containing playback parameters such as Tempo and Time-signature. */
  transport?: Transport;
  /** Track/Channel structure of this file. */
  structure: Lane[];
  /** The main Arrangement timeline of this file. */
  arrangement?: Arrangement;
  /** Clip Launcher scenes of this file. */
  scenes: Scene[];

  constructor(
    version?: string,
    application?: Application,
    transport?: Transport,
    structure?: Lane[],
    arrangement?: Arrangement,
    scenes?: Scene[]
  ) {
    super();
    this.version = version || Project.CURRENT_VERSION;
    this.application = application || new Application(); // Provide default values for required attributes
    this.transport = transport;
    this.structure = structure || [];
    this.arrangement = arrangement;
    this.scenes = scenes || [];
  }

  toXmlObject(): any {
    const obj: any = {
      Project: {},
    };

    // add required attribute
    Utility.addAttribute(obj.Project, "version", this, { required: true });

    if (this.application) {
      obj.Project.Application = this.application.toXmlObject().Application;
    }

    if (this.transport) {
      obj.Project.Transport = this.transport.toXmlObject().Transport;
    }

    // add children directly
    const groupedStructure = Utility.groupChildrenByTagName(this.structure);
    if (groupedStructure) {
      obj.Project.Structure = {
        ...groupedStructure,
      };
    }

    if (this.arrangement) {
      obj.Project.Arrangement = this.arrangement.toXmlObject().Arrangement;
    }

    if (this.scenes && this.scenes.length > 0) {
      obj.Project.Scenes = {
        Scene: this.scenes.map(scene => scene.toXmlObject().Scene),
      };
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    // validate and populate required attribute
    Utility.populateAttribute<string>(xmlObject, "version", this, {
      required: true,
    });

    if (xmlObject.Application) {
      this.application = new Application().fromXmlObject(xmlObject.Application);
    }

    if (xmlObject.Transport) {
      this.transport = new Transport().fromXmlObject(xmlObject.Transport);
    }

    const structure: Lane[] = [];
    if (xmlObject.Structure) {
      // Use the LaneRegistry to determine the correct subclass of Lane
      this.structure = []; // Initialize the structure array
      Utility.populateChildrenFromXml<Lane>(
        xmlObject.Structure,
        "structure",
        this,
        {
          createFromXml: (tagName: string, xmlData: any) =>
            LaneRegistry.createLaneFromXml(tagName, xmlData),
        },
        {
          onError: (error: unknown, tagName: string) => {
            console.error(
              `Error deserializing nested lane element in Structure: ${tagName}`,
              error
            );
          },
        }
      );
    }

    if (xmlObject.Arrangement) {
      this.arrangement = new Arrangement().fromXmlObject(xmlObject.Arrangement);
    }

    const scenes: Scene[] = [];
    if (xmlObject.Scenes && xmlObject.Scenes.Scene) {
      const sceneArray = Array.isArray(xmlObject.Scenes.Scene)
        ? xmlObject.Scenes.Scene
        : [xmlObject.Scenes.Scene];

      sceneArray.forEach((sceneObj: any) => {
        scenes.push(new Scene().fromXmlObject(sceneObj));
      });
    }
    this.scenes = scenes;

    return this;
  }
}
