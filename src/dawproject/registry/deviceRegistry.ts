import { Device } from "../device/device";
import { BaseConstructor, BaseFactory, BaseRegistry } from "./baseRegistry";

export interface DeviceConstructor extends BaseConstructor<Device> {}

export interface DeviceFactory extends BaseFactory<Device> {}

export class DeviceRegistry extends BaseRegistry<Device> {
  private static instance: DeviceRegistry;

  private constructor() {
    super("device");
  }

  static getInstance(): DeviceRegistry {
    if (!DeviceRegistry.instance) {
      DeviceRegistry.instance = new DeviceRegistry();
    }
    return DeviceRegistry.instance;
  }

  static register(
    tagName: string,
    deviceClass: DeviceConstructor,
    factory: DeviceFactory
  ): void {
    DeviceRegistry.getInstance().register(tagName, deviceClass, factory);
  }

  static getDeviceClass(tagName: string): DeviceConstructor | undefined {
    return DeviceRegistry.getInstance().getConstructor(tagName);
  }

  static createDeviceFromXml(
    tagName: string,
    xmlObject: any
  ): Device | undefined {
    const factory = DeviceRegistry.getInstance().getFactory(tagName);
    if (factory) {
      return factory(xmlObject);
    }
    return undefined;
  }
}

export function registerDevice(tagName: string, factory: DeviceFactory) {
  return function (target: DeviceConstructor) {
    DeviceRegistry.register(tagName, target, factory);
  };
}
