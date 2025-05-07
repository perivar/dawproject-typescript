import { BoolParameter } from "../boolParameter";
import { IFileReference, IParameter, IPlugin } from "../types";
import { Utility } from "../utility";
import { Device } from "./device";
import { DeviceRole } from "./deviceRole";

/** Base class for all plug-in devices. */
export abstract class Plugin extends Device implements IPlugin {
  /** Version of the plug-in. */
  pluginVersion?: string;

  constructor(
    // Make required fields optional for deserialization, provide defaults
    deviceRole?: DeviceRole,
    deviceName?: string,
    enabled?: BoolParameter,
    loaded: boolean = true,
    deviceID?: string,
    deviceVendor?: string,
    state?: IFileReference,
    parameters?: IParameter[],
    name?: string,
    color?: string,
    comment?: string,
    pluginVersion?: string
  ) {
    // Provide default placeholders for required fields
    super(
      deviceRole || DeviceRole.AUDIO_FX, // Default placeholder
      deviceName || "", // Default placeholder
      enabled,
      loaded,
      deviceID,
      deviceVendor,
      state,
      parameters,
      name,
      color,
      comment
    );
    this.pluginVersion = pluginVersion;
  }

  toXmlObject(): any {
    const obj: any = {
      ...super.toXmlObject().Device,
    };

    // add optional attribute
    Utility.addAttribute(obj, "pluginVersion", this);

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject);

    // populate optional attribute
    Utility.populateAttribute(xmlObject, "pluginVersion", this);

    return this;
  }
}
