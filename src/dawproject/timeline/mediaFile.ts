import { DoubleAdapter } from "../doubleAdapter";
import { FileReference } from "../fileReference";
import type { IFileReference, IMediaFile } from "../types"; // Added IFileReference
import { Utility } from "../utility";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";

export abstract class MediaFile extends Timeline implements IMediaFile {
  duration: number;
  file: IFileReference;

  constructor(
    // Make file optional for deserialization, fromXmlObject will set it
    file?: IFileReference,
    duration: number = 0.0,
    name?: string,
    timeUnit?: TimeUnit
  ) {
    super(undefined, timeUnit, name); // MediaFile doesn't have a track attribute directly
    // Provide a default placeholder for file
    this.file = file || new FileReference("");
    this.duration = duration;
  }

  toXmlObject(): any {
    const obj: any = super.toXmlObject(); // get attributes from Timeline

    // add required duration attribute
    Utility.addAttribute(obj, "duration", this, {
      required: true,
      adapter: DoubleAdapter.toXml,
    });

    // handle the 'File' child directly
    if (this.file && "toXmlObject" in this.file) {
      obj.File = (this.file as FileReference).toXmlObject();
    } else if (this.file) {
      // handle case where file is IFileReference but not FileReference
      console.warn(
        "File property is IFileReference but not FileReference instance. Cannot call toXmlObject."
      );
    }

    // since MediaFile is abstract, it doesn't return a root element itself.
    // subclasses will wrap these attributes and children in their specific root tag.
    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Timeline

    // validate and populate required time attribute
    Utility.populateAttribute<number>(xmlObject, "duration", this, {
      required: true,
      adapter: DoubleAdapter.fromXml,
    });

    if (xmlObject.File) {
      this.file = new FileReference().fromXmlObject(xmlObject.File);
    } else {
      // Handle missing required file
      console.warn(
        "Missing required 'File' element in XML for MediaFile. Assigning default."
      );
      this.file = new FileReference(""); // Assign a default or throw error
    }
    return this;
  }
}
