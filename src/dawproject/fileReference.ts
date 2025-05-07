/** References a file either within a DAWPROJECT container or on disk. */
import { IFileReference } from "./types";
import { Utility } from "./utility";
import { XmlObject } from "./XmlObject";

/** References a file either within a DAWPROJECT container or on disk. */
export class FileReference extends XmlObject implements IFileReference {
  /** File path. either
   * <li>path within the container</li>
   * <li>relative to .dawproject file (when external = "true")</li>
   * <li>absolute path (when external = "true" and path starts with a slash or windows drive letter)</li>
   * */
  path: string;
  /** When true, the path is relative to the .dawproject file. Default value is false. */
  external?: boolean;

  constructor(path?: string, external: boolean = false) {
    super();
    // Make path optional for deserialization, fromXmlObject will set it
    this.path = path || ""; // Provide a default placeholder
    this.external = external;
  }

  toXmlObject(): any {
    const obj: any = {};

    // add required path attribute
    Utility.addAttribute(obj, "path", this, { required: true });

    // add optional external attribute
    Utility.addAttribute(obj, "external", this);

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    // validate and populate required path attribute
    Utility.populateAttribute<string>(xmlObject, "path", this, {
      required: true,
    });

    // populate optional external attribute
    Utility.populateAttribute<boolean>(xmlObject, "external", this, {
      castTo: Boolean,
    });

    return this;
  }
}
