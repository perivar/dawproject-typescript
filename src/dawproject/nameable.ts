import { INameable } from "./types";
import { Utility } from "./utility";
import { XmlObject } from "./XmlObject";

export abstract class Nameable extends XmlObject implements INameable {
  /** Name/label of this object. */
  name?: string;
  /** Color of this object in HTML-style format. (#rrggbb) */
  color?: string;
  /** Comment/description of this object. */
  comment?: string;

  constructor(name?: string, color?: string, comment?: string) {
    super();
    this.name = name;
    this.color = color;
    this.comment = comment;
  }

  toXmlObject(): any {
    const attributes: any = {};

    // add optional attributes
    Utility.addAttribute(attributes, "name", this);
    Utility.addAttribute(attributes, "color", this);
    Utility.addAttribute(attributes, "comment", this);

    return attributes;
  }

  fromXmlObject(xmlObject: any): this {
    // populate optional attributes
    Utility.populateAttribute(xmlObject, "name", this);
    Utility.populateAttribute(xmlObject, "color", this);
    Utility.populateAttribute(xmlObject, "comment", this);

    return this;
  }
}
