import { BoolParameter } from "../boolParameter";
import { RealParameter } from "../realParameter";
import { registerDevice } from "../registry/deviceRegistry";
import type { ICompressor, IFileReference, IParameter } from "../types";
import { BuiltInDevice } from "./builtInDevice";
import { DeviceRole } from "./deviceRole";

const compressorFactory = (xmlObject: any): Compressor => {
  const instance = new Compressor();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerDevice("Compressor", compressorFactory)
export class Compressor extends BuiltInDevice implements ICompressor {
  threshold?: RealParameter;
  ratio?: RealParameter;
  attack?: RealParameter;
  release?: RealParameter;
  inputGain?: RealParameter;
  outputGain?: RealParameter;
  autoMakeup?: BoolParameter;

  constructor(
    // Make required fields optional for deserialization, provide defaults
    deviceRole?: DeviceRole,
    deviceName?: string,
    threshold?: RealParameter,
    ratio?: RealParameter,
    attack?: RealParameter,
    release?: RealParameter,
    inputGain?: RealParameter,
    outputGain?: RealParameter,
    autoMakeup?: BoolParameter,
    enabled?: BoolParameter,
    loaded?: boolean,
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
      undefined, // deviceType is handled by the class name
      enabled,
      loaded,
      deviceID,
      deviceVendor,
      state,
      parameters,
      name,
      color,
      comment
    ); // Pass relevant args to BuiltInDevice constructor
    this.threshold = threshold;
    this.ratio = ratio;
    this.attack = attack;
    this.release = release;
    this.inputGain = inputGain;
    this.outputGain = outputGain;
    this.autoMakeup = autoMakeup;
  }

  toXmlObject(): any {
    const obj: any = {
      Compressor: {
        ...super.toXmlObject().BuiltinDevice, // get attributes and children from BuiltInDevice's toXmlObject
      },
    };

    if (this.attack) {
      obj.Compressor.Attack = this.attack.toXmlObject().RealParameter;
    }

    if (this.autoMakeup) {
      obj.Compressor.AutoMakeup = this.autoMakeup.toXmlObject().BoolParameter;
    }

    if (this.inputGain) {
      obj.Compressor.InputGain = this.inputGain.toXmlObject().RealParameter;
    }

    if (this.outputGain) {
      obj.Compressor.OutputGain = this.outputGain.toXmlObject().RealParameter;
    }

    if (this.ratio) {
      obj.Compressor.Ratio = this.ratio.toXmlObject().RealParameter;
    }

    if (this.release) {
      obj.Compressor.Release = this.release.toXmlObject().RealParameter;
    }

    if (this.threshold) {
      obj.Compressor.Threshold = this.threshold.toXmlObject().RealParameter;
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from BuiltInDevice

    if (xmlObject.Attack) {
      this.attack = new RealParameter().fromXmlObject(xmlObject.Attack);
    }

    if (xmlObject.AutoMakeup) {
      this.autoMakeup = new BoolParameter().fromXmlObject(xmlObject.AutoMakeup);
    }

    if (xmlObject.InputGain) {
      this.inputGain = new RealParameter().fromXmlObject(xmlObject.InputGain);
    }

    if (xmlObject.OutputGain) {
      this.outputGain = new RealParameter().fromXmlObject(xmlObject.OutputGain);
    }

    if (xmlObject.Ratio) {
      this.ratio = new RealParameter().fromXmlObject(xmlObject.Ratio);
    }

    if (xmlObject.Release) {
      this.release = new RealParameter().fromXmlObject(xmlObject.Release);
    }

    if (xmlObject.Threshold) {
      this.threshold = new RealParameter().fromXmlObject(xmlObject.Threshold);
    }

    return this;
  }
}
