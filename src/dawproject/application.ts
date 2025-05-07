import { IApplication } from "./types";
import { Utility } from "./utility";
import { XmlObject } from "./XmlObject";

/** Metadata about the application which saved the DAWPROJECT file. */
export class Application extends XmlObject implements IApplication {
  /** Name of the application. */
  name: string;
  /** Version number of the application. */
  version: string;

  constructor(name?: string, version?: string) {
    super();
    this.name = name || "";
    this.version = version || "";
  }

  toXmlObject(): any {
    const obj = {
      Application: {},
    };

    // add required attributes
    Utility.addAttribute(obj.Application, "name", this, {
      required: true,
    });
    Utility.addAttribute(obj.Application, "version", this, {
      required: true,
    });

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    // validate and populate required attributes
    Utility.populateAttribute(xmlObject, "name", this, {
      required: true,
    });
    Utility.populateAttribute(xmlObject, "version", this, {
      required: true,
    });

    return this;
  }
}
