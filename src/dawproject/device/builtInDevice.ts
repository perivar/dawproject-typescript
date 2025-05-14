import { BoolParameter } from "../boolParameter";
import { DeviceRegistry, registerDevice } from "../registry/deviceRegistry";
import type { IBuiltInDevice, IFileReference, IParameter } from "../types";
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

    for (const tagName in xmlObject) {
      // Skip attributes (those starting with @_)
      if (tagName.startsWith("@_")) continue;

      // Use DeviceRegistry to create device instances
      const device = DeviceRegistry.createDeviceFromXml(
        tagName,
        xmlObject[tagName]
      );
      if (device) {
        this.deviceType = device;
        break; // We found and processed the device type
      }
    }

    return this;
  }
}
