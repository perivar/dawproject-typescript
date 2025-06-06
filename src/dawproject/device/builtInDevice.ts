import { BoolParameter } from "../boolParameter";
import { Utility } from "../utility"; // Import Utility
import { DeviceRegistry, registerDevice } from "../registry/deviceRegistry";
import type {
  IBuiltInDevice,
  IFileReference,
  IParameter,
  IDevice,
} from "../types"; // Import IDevice
import { Device } from "./device";
import { DeviceRole } from "./deviceRole";

const builtInDeviceFactory = (xmlObject: any): BuiltInDevice => {
  const instance = new BuiltInDevice();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerDevice("BuiltinDevice", builtInDeviceFactory)
export class BuiltInDevice extends Device implements IBuiltInDevice {
  deviceType?: Device;

  constructor(
    // Make required fields optional for deserialization, provide defaults
    deviceRole?: DeviceRole,
    deviceName?: string,
    deviceType?: Device,
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
    this.deviceType = deviceType;
  }

  toXmlObject(): any {
    const obj: any = {
      BuiltinDevice: {
        ...super.toXmlObject().Device, // get attributes from Device
      },
    };

    if (this.deviceType) {
      const deviceTypeObj = this.deviceType.toXmlObject();
      const deviceTypeName = Object.keys(deviceTypeObj)[0];
      obj.BuiltinDevice[deviceTypeName] = deviceTypeObj[deviceTypeName];
    }

    return obj;
  }

  public fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Device

    // Process child elements to find the device type using the registry
    Utility.populateChildFromXml<IDevice>(
      xmlObject,
      "deviceType",
      this,
      {
        createFromXml: (tagName: string, xmlData: any) =>
          DeviceRegistry.createDeviceFromXml(tagName, xmlData),
      },
      {
        onError: (error: unknown, tagName: string) => {
          console.error(
            `Error deserializing nested device element ${tagName} in BuiltInDevice:`,
            error
          );
        },
      }
    );

    return this;
  }
}
