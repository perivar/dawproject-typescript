import { Nameable } from "./nameable";
import { IReferenceable } from "./types";
import { Utility } from "./utility";

export abstract class Referenceable extends Nameable implements IReferenceable {
  /** Unique string identifier of this element. This is used for referencing this instance from other elements. */
  id: string;
  private static ID_COUNTER = 0;
  private static _instances: { [id: string]: Referenceable } = {};

  /** call before export */
  static resetIdCounter(): void {
    Referenceable.ID_COUNTER = 0;
    Referenceable._instances = {};
  }

  constructor(name?: string, color?: string, comment?: string) {
    super(name, color, comment);
    this.id = `id${Referenceable.ID_COUNTER++}`;
    Referenceable._instances[this.id] = this;
  }

  toXmlObject(): any {
    const attributes = super.toXmlObject(); // get attributes from Nameable

    // add required attribute
    Utility.addAttribute(attributes, "id", this, {
      required: true,
    });

    return attributes;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Nameable

    // validate and populate required attribute
    Utility.populateAttribute(xmlObject, "id", this, {
      required: true,
    });

    // register instance for reference lookup
    Referenceable._instances[this.id] = this;

    return this;
  }

  static getById(id: string): Referenceable | undefined {
    return Referenceable._instances[id];
  }
}
