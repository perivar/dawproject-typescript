import { BoolParameter } from "../boolParameter";
import { registerDevice } from "../registry/deviceRegistry";
import type { IFileReference, IParameter, IVst3Plugin } from "../types";
import { DeviceRole } from "./deviceRole";
import { Plugin } from "./plugin";

/** A VST3 Plug-in instance.
 * The VST3 plug-in state should be stored in .vstpreset format.
 */
const vst3PluginFactory = (xmlObject: any): Vst3Plugin => {
  const instance = new Vst3Plugin();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerDevice("Vst3Plugin", vst3PluginFactory)
export class Vst3Plugin extends Plugin implements IVst3Plugin {
  constructor(
    // Make required fields optional for deserialization, provide defaults
    deviceName?: string,
    pluginVersion?: string,
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
      DeviceRole.AUDIO_FX, // Default to audio effect role
      deviceName || "", // Default placeholder
      enabled,
      loaded,
      deviceID,
      deviceVendor,
      state,
      parameters,
      name,
      color,
      comment,
      pluginVersion
    );
  }

  toXmlObject(): any {
    const pluginContent = super.toXmlObject(); // get attributes and children from Plugin's toXmlObject

    return {
      Vst3Plugin: pluginContent, // Wrap the content in the Vst3Plugin tag
    };
  }
}
