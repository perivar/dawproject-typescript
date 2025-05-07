import { Channel } from "./channel";
import { ContentType } from "./contentType";
import { FileReference } from "./fileReference";
import { MixerRole } from "./mixerRole";
import { RealParameter } from "./realParameter";
import { Audio } from "./timeline/audio";
import { Clip } from "./timeline/clip";
import { Clips } from "./timeline/clips";
import { Timeline } from "./timeline/timeline";
import { TimeUnit } from "./timeline/timeUnit";
import { Warp } from "./timeline/warp";
import { Track } from "./track";
import { Unit } from "./unit";

export class Utility {
  /**
   * Adds an attribute from a target object to an XML attributes object, handling optionality and value adaptation.
   * If the attribute is required and the value (after potential adaptation) is undefined, it throws an error.
   * If the attribute is optional and the value is undefined, it does nothing.
   * @param attributes The object to add the attribute to (e.g., for XML serialization).
   * @param attributeName The name of the attribute (without '@_').
   * @param targetObject The object containing the attribute value.
   * @param options Configuration options.
   * @param options.required If true, throws an error if the final attributeValue is undefined. Defaults to false.
   * @param options.adapter An optional function to convert the attributeValue before adding it (e.g., DoubleAdapter.toXml).
   *                        The adapter should return the processed value or undefined if it shouldn't be added.
   * @param options.sourceProperty The name of the property on the targetObject to get the value from. Defaults to attributeName.
   *
   * @example
   * // Add a required attribute
   * Utility.addAttribute(attributes, "name", this, { required: true });
   *
   * @example
   * // Add an optional attribute
   * Utility.addAttribute(attributes, "color", this);
   *
   * @example
   * // Add an optional attribute using an adapter (e.g., duration with DoubleAdapter)
   * Utility.addAttribute(attributes, "duration", this, { adapter: DoubleAdapter.toXml });
   *
   * @example
   * // Add an optional enum attribute (e.g., timeUnit)
   * Utility.addAttribute(attributes, "contentTimeUnit", this);
   *
   * @example
   * // Add an optional boolean attribute (e.g., solo)
   * Utility.addAttribute(attributes, "solo", this);
   *
   * @example
   * // Add an optional attribute using a source property (e.g., destination.id)
   * Utility.addAttribute(attributes, "destination", this, { sourceProperty: "destination.id" });
   */
  static addAttribute(
    attributes: any,
    attributeName: string,
    targetObject: any,
    options?: {
      required?: boolean;
      adapter?: (value: any) => any | undefined;
      sourceProperty?: string;
    }
  ): void {
    const isRequired = options?.required || false;
    const sourceProperty = options?.sourceProperty || attributeName;

    // Helper function to get nested property value
    const getNestedPropertyValue = (obj: any, path: string) => {
      return path.split(".").reduce((current, property) => {
        return current ? current[property] : undefined;
      }, obj);
    };

    const attributeValue = getNestedPropertyValue(targetObject, sourceProperty);
    let finalValue = attributeValue;

    if (options?.adapter) {
      finalValue = options.adapter(attributeValue);
    }

    if (finalValue !== undefined) {
      attributes[`@_${attributeName}`] = finalValue;
    } else if (isRequired) {
      throw new Error(
        `Required attribute '${attributeName}' missing or invalid after adaptation`
      );
    }
    // If not required and value is undefined (or adapter returned undefined), do nothing.
  }

  /**
   * Populates a target object's property from an XML attribute, handling various types,
   * validation, and optionality.
   *
   * @template T The expected type of the attribute value after processing.
   * @param xmlObject The XML object (parsed from XML) containing the attribute.
   * @param attributeName The name of the attribute in the XML (without the '@_').
   * @param targetObject The object whose property should be populated.
   * @param options Configuration options for processing the attribute.
   * @param options.required If true, throws an error if the attribute is missing. Defaults to false.
   * @param options.castTo The constructor of the type to cast the value to (e.g., Number, Boolean, MixerRole, Interpolation).
   *                       Use for primitive types (Number, Boolean) and simple string-based enums/types.
   *                       For complex types requiring specific parsing logic, use an adapter instead.
   * @param options.adapter A function to convert the raw XML attribute value to the desired type T.
   *                        Use for complex types or when specific parsing logic is needed (e.g., DoubleAdapter.fromXml).
   * @param options.validator A function to validate the processed value. Should return true if valid, false otherwise.
   * @param options.targetProperty The name of the property on the targetObject to populate. Defaults to attributeName.
   *
   * @example
   * // Required number attribute (e.g., numerator)
   * Utility.populateAttribute<number>(xmlObject, "numerator", this, { required: true, castTo: Number });
   *
   * @example
   * // Required enum attribute (e.g., role)
   * Utility.populateAttribute<MixerRole>(xmlObject, "role", this, { required: true, castTo: MixerRole });
   *
   * @example
   * // Required number attribute with specific validator (e.g., audioChannels > 0)
   * Utility.populateAttribute<number>(xmlObject, "audioChannels", this, {
   *   required: true,
   *   castTo: Number,
   *   validator: (v) => v > 0
   * });
   *
   * @example
   * // Optional boolean attribute (e.g., solo)
   * Utility.populateAttribute<boolean>(xmlObject, "solo", this, { castTo: Boolean });
   *
   * @example
   * // Required attribute using an adapter (e.g., value with DoubleAdapter)
   * Utility.populateAttribute<number>(xmlObject, "value", this, {
   *   required: true,
   *   adapter: DoubleAdapter.fromXml
   * });
   *
   * @example
   * // Optional enum attribute (e.g., interpolation)
   * Utility.populateAttribute<Interpolation>(xmlObject, "interpolation", this, { castTo: Interpolation });
   *
   * @example
   * // Optional string attribute (e.g., algorithm) - no castTo/adapter needed
   * Utility.populateAttribute<string>(xmlObject, "algorithm", this);
   */
  static populateAttribute<T>(
    xmlObject: any,
    attributeName: string,
    targetObject: any,
    options?: {
      required?: boolean;
      castTo?: any;
      adapter?: (value: any) => T | undefined;
      validator?: (value: T) => boolean;
      targetProperty?: string;
    }
  ): void {
    const xmlAttributeName = `@_${attributeName}`;
    const targetProperty = options?.targetProperty || attributeName;
    const isRequired = options?.required || false;

    if (!xmlObject[xmlAttributeName]) {
      if (isRequired) {
        throw new Error(`Required attribute '${attributeName}' missing in XML`);
      }
      return; // Optional attribute is missing, do nothing
    }

    const value = xmlObject[xmlAttributeName];
    let processedValue: any = value;

    if (options?.adapter) {
      processedValue = options.adapter(value);
      if (processedValue === undefined) {
        throw new Error(
          `Invalid value for attribute '${attributeName}' in XML`
        );
      }
    } else if (options?.castTo) {
      if (typeof options.castTo === "string") {
        throw new Error(
          `Invalid castTo option for attribute '${attributeName}'. Expected a constructor function (e.g., Number, Boolean, or an enum type), but received a string.`
        );
      }
      // Use constructor name for comparison to avoid TS errors
      if (options.castTo.name === "Number") {
        processedValue = parseInt(value, 10);
        if (isNaN(processedValue)) {
          throw new Error(
            `Invalid number value for attribute '${attributeName}' in XML`
          );
        }
      } else if (options.castTo.name === "Boolean") {
        processedValue = String(value).toLowerCase() === "true";
      } else {
        // Assuming other types can be directly cast or assigned
        // This cast might still be problematic if T is not directly assignable from string
        // Consider requiring an adapter for complex types.
        processedValue = value as T;
      }
    }

    if (options?.validator && !options.validator(processedValue)) {
      throw new Error(`Invalid value for attribute '${attributeName}' in XML`);
    }

    targetObject[targetProperty] = processedValue;
  }

  /**
   * Groups an array of objects by their root XML tag name after calling toXmlObject on each.
   * This is useful for creating nested XML structures where elements of different types
   * need to be grouped under their respective tag names.
   * @param children The array of objects to group. Each object is expected to have a toXmlObject method.
   * @returns An object where keys are XML tag names and values are arrays of the corresponding XML content,
   *          or undefined if the input array is null, undefined, or empty.
   */
  static groupChildrenByTagName(children: any[]): any | undefined {
    if (!children || children.length === 0) {
      return undefined;
    }

    return children.reduce((acc: any, child) => {
      const childObj = child.toXmlObject();
      const tagName = Object.keys(childObj)[0];
      if (!acc[tagName]) {
        acc[tagName] = [];
      }
      acc[tagName].push(childObj[tagName]);
      return acc;
    }, {});
  }

  /**
   * Creates a new Track instance with a configured Channel.
   * @param name The name of the track.
   * @param contentTypes The set of content types the track can hold.
   * @param mixerRole The role of the track in the mixer.
   * @param volume The initial volume level (linear).
   * @param pan The initial pan position (normalized).
   * @returns A new Track instance.
   */
  static createTrack(
    name: string,
    contentTypes: Set<ContentType>,
    mixerRole: MixerRole,
    volume: number,
    pan: number
  ): Track {
    const trackChannel = new Channel(
      mixerRole,
      2, // audioChannels default
      new RealParameter(volume, Unit.LINEAR),
      new RealParameter(pan, Unit.NORMALIZED)
      // mute, solo, destination, sends, devices are optional
    );
    const track = new Track(
      contentTypes ? Array.from(contentTypes) : [], // Convert Set to Array
      true, // loaded default
      trackChannel
      // tracks are optional
    );
    track.name = name; // Set name from Nameable
    return track;
  }

  /**
   * Creates a new Audio timeline instance.
   * @param relativePath The path to the audio file, relative to the project.
   * @param sampleRate The sample rate of the audio file.
   * @param channels The number of channels in the audio file.
   * @param duration The duration of the audio file in seconds.
   * @returns A new Audio instance.
   */
  static createAudio(
    relativePath: string,
    sampleRate: number,
    channels: number,
    duration: number
  ): Audio {
    const audio = new Audio(
      sampleRate,
      channels,
      duration,
      new FileReference(relativePath, false), // file (required)
      undefined, // algorithm optional
      undefined, // name optional
      TimeUnit.SECONDS // timeUnit default
    );
    return audio;
  }

  /**
   * Creates a new Warp point instance.
   * @param time The timeline time (in beats or seconds depending on context).
   * @param contentTime The corresponding time within the audio content (in seconds).
   * @returns A new Warp instance.
   */
  static createWarp(time: number, contentTime: number): Warp {
    const warp = new Warp(time, contentTime);
    return warp;
  }

  /**
   * Creates a new Clip instance.
   * @param content The timeline content of the clip (e.g., Audio, Notes).
   * @param time The start time of the clip on the parent timeline.
   * @param duration The duration of the clip on the parent timeline.
   * @returns A new Clip instance.
   */
  static createClip(content: Timeline, time: number, duration: number): Clip {
    const clip = new Clip(
      time,
      duration,
      undefined, // contentTimeUnit optional
      undefined, // playStart optional
      undefined, // playStop optional
      undefined, // loopStart optional
      undefined, // loopEnd optional
      undefined, // fadeTimeUnit optional
      undefined, // fadeInTime optional
      undefined, // fadeOutTime optional
      content // content
      // reference optional
      // name, color, comment optional
    );
    return clip;
  }

  /**
   * Creates a new Clips timeline instance containing the provided clips.
   * @param clips The Clip instances to include in the timeline.
   * @returns A new Clips instance.
   */
  static createClips(...clips: Clip[]): Clips {
    const clipsTimeline = new Clips(clips);
    return clipsTimeline;
  }
}
