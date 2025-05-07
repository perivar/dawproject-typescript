import { BoolParameter } from "../boolParameter";
import { FileReference } from "../fileReference";
import { Parameter } from "../parameter";
import { RealParameter } from "../realParameter";
import { Referenceable } from "../referenceable";
import { TimeSignatureParameter } from "../timeSignatureParameter";
import type { IDevice, IFileReference, IParameter } from "../types";
import { Utility } from "../utility";
import { DeviceRole } from "./deviceRole";

export abstract class Device extends Referenceable implements IDevice {
  deviceRole: DeviceRole;
  deviceName: string;
  enabled?: BoolParameter;
  loaded?: boolean;
  deviceID?: string;
  deviceVendor?: string;
  state?: IFileReference;
  parameters: IParameter[];

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
    comment?: string
  ) {
    super(name, color, comment);
    // Initialize required fields with defaults or placeholders
    // fromXmlObject will overwrite these with actual values from XML
    this.deviceRole = deviceRole || DeviceRole.AUDIO_FX; // Default placeholder
    this.deviceName = deviceName || ""; // Default placeholder
    this.enabled = enabled;
    this.loaded = loaded;
    this.deviceID = deviceID;
    this.deviceVendor = deviceVendor;
    this.state = state;
    this.parameters = parameters || [];
  }

  toXmlObject(): any {
    const obj: any = {
      Device: {
        ...super.toXmlObject(), // get attributes from Referenceable
      },
    };

    // add required attributes
    Utility.addAttribute(obj.Device, "deviceRole", this, {
      required: true,
    });
    Utility.addAttribute(obj.Device, "deviceName", this, {
      required: true,
    });

    // add optional attributes
    Utility.addAttribute(obj.Device, "loaded", this);
    Utility.addAttribute(obj.Device, "deviceID", this);
    Utility.addAttribute(obj.Device, "deviceVendor", this);

    // Add children directly
    const groupedParameters = Utility.groupChildrenByTagName(this.parameters);
    if (groupedParameters) {
      obj.Device.Parameters = groupedParameters;
    }

    if (this.enabled !== undefined) {
      obj.Device.Enabled = this.enabled.toXmlObject().BoolParameter;
    }

    if (this.state) {
      obj.Device.State = (this.state as FileReference).toXmlObject();
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Referenceable

    // validate and populate required attributes
    Utility.populateAttribute<DeviceRole>(xmlObject, "deviceRole", this, {
      required: true,
    });
    Utility.populateAttribute<string>(xmlObject, "deviceName", this, {
      required: true,
    });

    // populate optional attributes
    Utility.populateAttribute<boolean>(xmlObject, "loaded", this, {
      castTo: Boolean,
    });
    Utility.populateAttribute<string>(xmlObject, "deviceID", this);
    Utility.populateAttribute<string>(xmlObject, "deviceVendor", this);

    if (xmlObject.Enabled) {
      this.enabled = new BoolParameter().fromXmlObject(xmlObject.Enabled);
    }

    if (xmlObject.State) {
      this.state = new FileReference().fromXmlObject(xmlObject.State);
    }

    const parameters: Parameter[] = [];
    if (xmlObject.Parameters) {
      const parameterTypeMap: { [key: string]: (obj: any) => Parameter } = {
        BoolParameter: new BoolParameter().fromXmlObject,
        RealParameter: new RealParameter().fromXmlObject,
        TimeSignatureParameter: new TimeSignatureParameter().fromXmlObject,
      };

      for (const tagName in xmlObject.Parameters) {
        if (parameterTypeMap[tagName]) {
          const parameterData = xmlObject.Parameters[tagName];
          const parameterArray = Array.isArray(parameterData)
            ? parameterData
            : [parameterData];
          parameterArray.forEach((paramObj: any) => {
            try {
              parameters.push(parameterTypeMap[tagName](paramObj));
            } catch (e) {
              console.error(
                `Error deserializing nested parameter element ${tagName} in Device:`,
                e
              );
            }
          });
        } else {
          console.warn(
            `Skipping deserialization of unknown nested parameter element in Device: ${tagName}`
          );
        }
      }
    }
    this.parameters = parameters;

    return this;
  }
}
