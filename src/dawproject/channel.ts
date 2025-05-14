import { BoolParameter } from "./boolParameter";
import { Device } from "./device/device";
import { Lane } from "./lane";
import { MixerRole } from "./mixerRole";
import { RealParameter } from "./realParameter";
import { Referenceable } from "./referenceable";
import { DeviceRegistry } from "./registry/deviceRegistry";
import { registerLane } from "./registry/laneRegistry";
import { Send } from "./send";
import { IChannel, IDevice } from "./types";
import { Utility } from "./utility";

/**
 * Represents a mixer channel. It provides the ability to route signals to other channels and can contain
 * Device/Plug-in for processing.
 */

const channelFactory = (xmlObject: any): Channel => {
  const instance = new Channel();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerLane("Channel", channelFactory)
export class Channel extends Lane implements IChannel {
  /** Role of this channel in the mixer. */
  role?: MixerRole;
  /** Number of audio-channels of this mixer channel. (1=mono, 2=stereo…) */
  audioChannels?: number;
  /** Channel volume */
  volume?: RealParameter;
  /** Channel pan/balance */
  pan?: RealParameter;
  /** Channel mute */
  mute?: BoolParameter;
  /** Channel solo */
  solo?: boolean;
  /** Output channel routing */
  destination?: IChannel; // Reference to another Channel
  /** Send levels & destination */
  sends: Send[];
  /** Devices & plug-ins of this channel */
  devices: IDevice[];

  constructor(
    role?: MixerRole,
    audioChannels: number = 2,
    volume?: RealParameter,
    pan?: RealParameter,
    mute?: BoolParameter,
    solo?: boolean,
    destination?: Channel,
    sends?: Send[],
    devices?: Device[],
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.role = role;
    this.audioChannels = audioChannels;
    this.volume = volume;
    this.pan = pan;
    this.mute = mute;
    this.solo = solo;
    this.destination = destination;
    this.sends = sends || [];
    this.devices = devices || [];
  }

  toXmlObject(): any {
    const obj: any = {
      Channel: {
        ...super.toXmlObject(),
      },
    };

    // add optional attributes
    Utility.addAttribute(obj.Channel, "role", this);
    Utility.addAttribute(obj.Channel, "audioChannels", this);
    Utility.addAttribute(obj.Channel, "solo", this);
    Utility.addAttribute(obj.Channel, "destination", this, {
      sourceProperty: "destination.id",
    });

    // Add children directly
    const groupedDevices = Utility.groupChildrenByTagName(this.devices);
    if (groupedDevices) {
      obj.Channel.Devices = groupedDevices;
    }

    // Add optional elements, each in their proper XML element form
    if (this.mute) {
      obj.Channel.Mute = this.mute.toXmlObject().BoolParameter;
    }
    if (this.pan) {
      obj.Channel.Pan = this.pan.toXmlObject().RealParameter;
    }
    if (this.volume) {
      obj.Channel.Volume = this.volume.toXmlObject().RealParameter;
    }
    if (this.sends && this.sends.length > 0) {
      obj.Channel.Sends = {
        Send: this.sends.map(send => send.toXmlObject().Send),
      };
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Lane

    // handle optional attributes
    Utility.populateAttribute<MixerRole>(xmlObject, "role", this, {
      castTo: MixerRole,
    });

    Utility.populateAttribute<number>(xmlObject, "audioChannels", this, {
      castTo: Number,
      validator: v => v > 0,
    });

    Utility.populateAttribute<boolean>(xmlObject, "solo", this, {
      castTo: Boolean,
    });

    // Handle optional elements
    if (xmlObject.Volume) {
      this.volume = new RealParameter().fromXmlObject(xmlObject.Volume);
    }

    if (xmlObject.Pan) {
      this.pan = new RealParameter().fromXmlObject(xmlObject.Pan);
    }

    if (xmlObject.Mute) {
      this.mute = new BoolParameter().fromXmlObject(xmlObject.Mute);
    }

    // read destination ID and look it up in the Referenceable registry
    const destinationId = xmlObject["@_destination"];
    if (destinationId) {
      const destination = Referenceable.getById(destinationId);
      // Check if the retrieved object is a Channel before assigning
      if (destination instanceof Channel) {
        this.destination = destination;
      } else {
        console.warn(
          `Retrieved object with ID ${destinationId} is not a Channel and cannot be assigned as a destination.`
        );
        this.destination = undefined; // Ensure destination is undefined if not a Channel
      }
    }

    // Handle sends array with proper error handling
    this.sends = [];
    if (xmlObject.Sends?.Send) {
      const sendArray = Array.isArray(xmlObject.Sends.Send)
        ? xmlObject.Sends.Send
        : [xmlObject.Sends.Send];

      this.sends = sendArray.map((sendObj: any) => {
        try {
          return new Send().fromXmlObject(sendObj);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to parse Send: ${message}`);
        }
      });
    }

    const devices: IDevice[] = [];
    if (xmlObject.Devices) {
      // Iterate through all properties in xmlObject.Devices to find Device elements
      for (const tagName in xmlObject.Devices) {
        // Skip attributes (those starting with @_)
        if (tagName.startsWith("@_")) continue;

        // Use DeviceRegistry to create device instances
        const DeviceClass = DeviceRegistry.getDeviceClass(tagName);
        if (DeviceClass) {
          const deviceData = xmlObject.Devices[tagName];
          const deviceArray = Array.isArray(deviceData)
            ? deviceData
            : [deviceData];

          for (const deviceObj of deviceArray) {
            try {
              // Create a new instance and call fromXmlObject on it
              const deviceInstance = new DeviceClass().fromXmlObject(deviceObj);
              devices.push(deviceInstance);
            } catch (e) {
              console.error(
                `Error deserializing nested device element ${tagName} in Channel:`,
                e
              );
            }
          }
        } else {
          console.warn(
            `Skipping deserialization of unknown nested device element in Channel: ${tagName}`
          );
        }
      }
    }
    this.devices = devices;

    return this;
  }
}
