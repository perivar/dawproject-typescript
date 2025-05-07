import { ContentType } from "./contentType";
import { DeviceRole } from "./device/deviceRole";
import { EqBandType } from "./device/eqBandType";
import { ExpressionType } from "./expressionType";
import { Interpolation } from "./interpolation";
import { MixerRole } from "./mixerRole";
import { SendType } from "./sendType";
import { TimeUnit } from "./timeline/timeUnit";
import { Unit } from "./unit";

// Base Interfaces

/**
 * Corresponds to the `nameable` complex type in DAWProject.xsd.
 * Base interface for elements that have a name, color, and comment.
 */
export interface INameable {
  /**
   * Corresponds to the `name` attribute in DAWProject.xsd.
   * The name of the element.
   */
  name?: string;
  /**
   * Corresponds to the `color` attribute in DAWProject.xsd.
   * The color of the element.
   */
  color?: string;
  /**
   * Corresponds to the `comment` attribute in DAWProject.xsd.
   * A comment for the element.
   */
  comment?: string;
}

/**
 * Corresponds to the `referenceable` complex type in DAWProject.xsd.
 * Base interface for elements that can be referenced by an ID. Extends INameable.
 */
export interface IReferenceable extends INameable {
  /**
   * Corresponds to the `id` attribute in DAWProject.xsd.
   * A unique identifier for the element.
   */
  id: string;
}

// Parameter Interfaces

/**
 * Corresponds to the abstract `parameter` complex type in DAWProject.xsd.
 * Base interface for all parameter types. Extends IReferenceable.
 */
export interface IParameter extends IReferenceable {
  /**
   * Corresponds to the `parameterID` attribute in DAWProject.xsd.
   * The ID of the parameter within its parent device.
   */
  parameterID?: number;
}

/**
 * Corresponds to the `boolParameter` complex type in DAWProject.xsd.
 * Represents a boolean parameter. Extends IParameter.
 */
export interface IBoolParameter extends IParameter {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The boolean value of the parameter.
   */
  value?: boolean;
}

/**
 * Corresponds to the `realParameter` complex type in DAWProject.xsd.
 * Represents a real-valued parameter. Extends IParameter.
 */
export interface IRealParameter extends IParameter {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The real value of the parameter.
   */
  value?: number;
  /**
   * Corresponds to the `unit` attribute in DAWProject.xsd.
   * The unit of the parameter value.
   */
  unit?: Unit;
  /**
   * Corresponds to the `min` attribute in DAWProject.xsd.
   * The minimum possible value for the parameter.
   */
  min?: number;
  /**
   * Corresponds to the `max` attribute in DAWProject.xsd.
   * The maximum possible value for the parameter.
   */
  max?: number;
}

/**
 * Corresponds to the `integerParameter` complex type in DAWProject.xsd.
 * Represents an integer parameter. Extends IParameter.
 */
export interface IIntegerParameter extends IParameter {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The integer value of the parameter.
   */
  value?: number;
  /**
   * Corresponds to the `min` attribute in DAWProject.xsd.
   * The minimum possible value for the parameter.
   */
  min?: number;
  /**
   * Corresponds to the `max` attribute in DAWProject.xsd.
   * The maximum possible value for the parameter.
   */
  max?: number;
}

/**
 * Corresponds to the `enumParameter` complex type in DAWProject.xsd.
 * Represents an enumerated parameter. Extends IParameter.
 */
export interface IEnumParameter extends IParameter {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The integer value representing the selected enumeration.
   */
  value?: number;
  /**
   * Corresponds to the `count` attribute in DAWProject.xsd.
   * The total number of possible enumeration values.
   */
  count: number;
  /**
   * Corresponds to the `labels` attribute in DAWProject.xsd.
   * A list of string labels for each enumeration value.
   */
  labels?: string[];
}

/**
 * Corresponds to the `timeSignatureParameter` complex type in DAWProject.xsd.
 * Represents a time signature parameter. Extends IParameter.
 */
export interface ITimeSignatureParameter extends IParameter {
  /**
   * Corresponds to the `numerator` attribute in DAWProject.xsd.
   * The numerator of the time signature.
   */
  numerator: number;
  /**
   * Corresponds to the `denominator` attribute in DAWProject.xsd.
   * The denominator of the time signature.
   */
  denominator: number;
}

// Timeline Interfaces

/**
 * Corresponds to the abstract `timeline` complex type in DAWProject.xsd.
 * Base interface for all timeline-based elements. Extends IReferenceable.
 */
export interface ITimeline extends IReferenceable {
  /**
   * Corresponds to the `timeUnit` attribute in DAWProject.xsd.
   * The time unit used for this timeline (e.g., beats, seconds).
   */
  timeUnit?: TimeUnit;
  /**
   * Corresponds to the `track` attribute in DAWProject.xsd.
   * Reference to the track this timeline belongs to.
   */
  track?: ITrack;
}

/**
 * Corresponds to the abstract `point` complex type in DAWProject.xsd.
 * Base interface for all points within a timeline.
 */
export interface IPoint {
  /**
   * Corresponds to the `time` attribute in DAWProject.xsd.
   * The time of the point within the timeline.
   */
  time: number;
}

/**
 * Corresponds to the `realPoint` complex type in DAWProject.xsd.
 * Represents a real-valued point in a timeline. Extends IPoint.
 */
export interface IRealPoint extends IPoint {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The real value of the point.
   */
  value: number;
  /**
   * Corresponds to the `interpolation` attribute in DAWProject.xsd.
   * The interpolation method to the next point.
   */
  interpolation?: Interpolation;
}

/**
 * Corresponds to the `boolPoint` complex type in DAWProject.xsd.
 * Represents a boolean point in a timeline. Extends IPoint.
 */
export interface IBoolPoint extends IPoint {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The boolean value of the point.
   */
  value: boolean;
}

/**
 * Corresponds to the `integerPoint` complex type in DAWProject.xsd.
 * Represents an integer point in a timeline. Extends IPoint.
 */
export interface IIntegerPoint extends IPoint {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The integer value of the point.
   */
  value: number;
}

/**
 * Corresponds to the `enumPoint` complex type in DAWProject.xsd.
 * Represents an enumerated point in a timeline. Extends IPoint.
 */
export interface IEnumPoint extends IPoint {
  /**
   * Corresponds to the `value` attribute in DAWProject.xsd.
   * The integer value representing the selected enumeration at this point.
   */
  value: number;
}

/**
 * Corresponds to the `timeSignaturePoint` complex type in DAWProject.xsd.
 * Represents a time signature change point in a timeline. Extends IPoint.
 */
export interface ITimeSignaturePoint extends IPoint {
  /**
   * Corresponds to the `numerator` attribute in DAWProject.xsd.
   * The numerator of the time signature at this point.
   */
  numerator: number;
  /**
   * Corresponds to the `denominator` attribute in DAWProject.xsd.
   * The denominator of the time signature at this point.
   */
  denominator: number;
}

/**
 * Corresponds to the `automationTarget` complex type in DAWProject.xsd.
 * Defines the target of an automation timeline.
 */
export interface IAutomationTarget {
  /**
   * Corresponds to the `parameter` attribute in DAWProject.xsd.
   * Reference to the parameter being automated.
   */
  parameter?: IParameter; // Reference ID to a Parameter
  /**
   * Corresponds to the `expression` attribute in DAWProject.xsd.
   * The type of expression being automated (e.g., gain, pan).
   */
  expression?: ExpressionType;
  /**
   * Corresponds to the `channel` attribute in DAWProject.xsd.
   * The MIDI channel for note expression automation.
   */
  channel?: number;
  /**
   * Corresponds to the `key` attribute in DAWProject.xsd.
   * The MIDI key for note expression automation.
   */
  key?: number;
  /**
   * Corresponds to the `controller` attribute in DAWProject.xsd.
   * The MIDI controller number for channel controller automation.
   */
  controller?: number;
}

/**
 * Corresponds to the `points` complex type in DAWProject.xsd.
 * Represents an automation timeline with a series of points. Extends ITimeline.
 */
export interface IPoints extends ITimeline {
  /**
   * Corresponds to the `Target` element in DAWProject.xsd.
   * The target of this automation timeline.
   */
  target: IAutomationTarget;
  /**
   * Corresponds to the `unit` attribute in DAWProject.xsd.
   * The unit of the values in the points.
   */
  unit?: Unit;
  /**
   * Corresponds to the choice of point elements (`RealPoint`, `BoolPoint`, etc.) in DAWProject.xsd.
   * An array of points in the automation timeline.
   */
  points: IPoint[]; // Array of specific point types (RealPoint, BoolPoint, etc.)
}

/**
 * Corresponds to the `marker` complex type in DAWProject.xsd.
 * Represents a marker in a timeline. Extends INameable.
 */
export interface IMarker extends INameable {
  /**
   * Corresponds to the `time` attribute in DAWProject.xsd.
   * The time of the marker within the timeline.
   */
  time: number;
}

/**
 * Corresponds to the `markers` complex type in DAWProject.xsd.
 * Represents a collection of markers in a timeline. Extends ITimeline.
 */
export interface IMarkers extends ITimeline {
  /**
   * Corresponds to the `Marker` element in DAWProject.xsd.
   * An array of markers.
   */
  markers: IMarker[];
}

/**
 * Corresponds to the `warp` complex type in DAWProject.xsd.
 * Represents a warp point for time stretching/compressing content.
 */
export interface IWarp {
  /**
   * Corresponds to the `time` attribute in DAWProject.xsd.
   * The time in the timeline.
   */
  time: number;
  /**
   * Corresponds to the `contentTime` attribute in DAWProject.xsd.
   * The corresponding time in the content.
   */
  contentTime: number;
}

/**
 * Corresponds to the `warps` complex type in DAWProject.xsd.
 * Represents a collection of warp points for a timeline. Extends ITimeline.
 */
export interface IWarps extends ITimeline {
  /**
   * Corresponds to the `contentTimeUnit` attribute in DAWProject.xsd.
   * The time unit used for the content time.
   */
  contentTimeUnit: TimeUnit;
  /**
   * Corresponds to the `Warp` element in DAWProject.xsd.
   * An array of warp points.
   */
  points: IWarp[];
}

/**
 * Corresponds to the `note` complex type in DAWProject.xsd.
 * Represents a MIDI note event.
 */
export interface INote {
  /**
   * Corresponds to the `time` attribute in DAWProject.xsd.
   * The start time of the note.
   */
  time: number;
  /**
   * Corresponds to the `duration` attribute in DAWProject.xsd.
   * The duration of the note.
   */
  duration: number;
  /**
   * Corresponds to the `key` attribute in DAWProject.xsd.
   * The MIDI key number (0-127).
   */
  key: number;
  /**
   * Corresponds to the `channel` attribute in DAWProject.xsd.
   * The MIDI channel (0-15).
   */
  channel?: number;
  /**
   * Corresponds to the `vel` attribute in DAWProject.xsd.
   * The note-on velocity (0-127).
   */
  velocity?: number;
  /**
   * Corresponds to the `rel` attribute in DAWProject.xsd.
   * The note-off velocity (0-127).
   */
  releaseVelocity?: number;
  /**
   * Corresponds to the choice of timeline elements within a note in DAWProject.xsd.
   * Automation timelines for note expressions (e.g., velocity, pitch bend).
   */
  expression?: IPoints[]; // Array of Points timelines for note expression
}

/**
 * Corresponds to the `notes` complex type in DAWProject.xsd.
 * Represents a collection of MIDI notes in a timeline. Extends ITimeline.
 */
export interface INotes extends ITimeline {
  /**
   * Corresponds to the `Note` element in DAWProject.xsd.
   * An array of notes.
   */
  notes: INote[];
}

/**
 * Corresponds to the `fileReference` complex type in DAWProject.xsd.
 * Represents a reference to an external file.
 */
export interface IFileReference {
  /**
   * Corresponds to the `path` attribute in DAWProject.xsd.
   * The path to the file.
   */
  path: string;
  /**
   * Corresponds to the `external` attribute in DAWProject.xsd.
   * Indicates if the file is external to the project package.
   */
  external?: boolean;
}

/**
 * Corresponds to the `mediaFile` complex type in DAWProject.xsd.
 * Base interface for media files like audio and video. Extends ITimeline.
 */
export interface IMediaFile extends ITimeline {
  /**
   * Corresponds to the `duration` attribute in DAWProject.xsd.
   * The duration of the media file.
   */
  duration: number;
  /**
   * Corresponds to the `File` element in DAWProject.xsd.
   * Reference to the media file.
   */
  file: IFileReference;
}

/**
 * Corresponds to the `audio` complex type in DAWProject.xsd.
 * Represents an audio file. Extends IMediaFile.
 */
export interface IAudio extends IMediaFile {
  /**
   * Corresponds to the `sampleRate` attribute in DAWProject.xsd.
   * The sample rate of the audio file.
   */
  sampleRate: number;
  /**
   * Corresponds to the `channels` attribute in DAWProject.xsd.
   * The number of audio channels.
   */
  channels: number;
  /**
   * Corresponds to the `algorithm` attribute in DAWProject.xsd.
   * The algorithm used for processing (e.g., time stretching).
   */
  algorithm?: string;
}

/**
 * Corresponds to the `video` complex type in DAWProject.xsd.
 * Represents a video file. Extends IMediaFile.
 */
export interface IVideo extends IMediaFile {
  /**
   * Corresponds to the `sampleRate` attribute in DAWProject.xsd.
   * The sample rate of the audio track in the video file.
   */
  sampleRate: number;
  /**
   * Corresponds to the `channels` attribute in DAWProject.xsd.
   * The number of audio channels in the video file.
   */
  channels: number;
  /**
   * Corresponds to the `algorithm` attribute in DAWProject.xsd.
   * The algorithm used for processing (e.g., time stretching).
   */
  algorithm?: string;
}

/**
 * Corresponds to the `clip` complex type in DAWProject.xsd.
 * Represents a clip in a timeline. Extends INameable.
 */
export interface IClip extends INameable {
  /**
   * Corresponds to the `time` attribute in DAWProject.xsd.
   * The start time of the clip in the parent timeline.
   */
  time: number;
  /**
   * Corresponds to the `duration` attribute in DAWProject.xsd.
   * The duration of the clip in the parent timeline.
   */
  duration?: number;
  /**
   * Corresponds to the `contentTimeUnit` attribute in DAWProject.xsd.
   * The time unit used for the clip's content.
   */
  contentTimeUnit?: TimeUnit;
  /**
   * Corresponds to the `playStart` attribute in DAWProject.xsd.
   * The start time within the clip's content to begin playback.
   */
  playStart?: number;
  /**
   * Corresponds to the `playStop` attribute in DAWProject.xsd.
   * The stop time within the clip's content to end playback.
   */
  playStop?: number;
  /**
   * Corresponds to the `loopStart` attribute in DAWProject.xsd.
   * The start time within the clip's content for looping.
   */
  loopStart?: number;
  /**
   * Corresponds to the `loopEnd` attribute in DAWProject.xsd.
   * The end time within the clip's content for looping.
   */
  loopEnd?: number;
  /**
   * Corresponds to the `fadeTimeUnit` attribute in DAWProject.xsd.
   * The time unit used for fade times.
   */
  fadeTimeUnit?: TimeUnit;
  /**
   * Corresponds to the `fadeInTime` attribute in DAWProject.xsd.
   * The duration of the fade-in.
   */
  fadeInTime?: number;
  /**
   * Corresponds to the `fadeOutTime` attribute in DAWProject.xsd.
   * The duration of the fade-out.
   */
  fadeOutTime?: number;
  /**
   * Corresponds to the choice of timeline elements within a clip in DAWProject.xsd.
   * The content of the clip (e.g., Notes, Audio, Video, Points).
   */
  content?: ITimeline;
  /**
   * Corresponds to the `reference` attribute in DAWProject.xsd.
   * Reference to another element (e.g., an Audio element) for shared content.
   */
  reference?: string; // Reference ID to another element (e.g., Audio)
}

/**
 * Corresponds to the `clips` complex type in DAWProject.xsd.
 * Represents a collection of clips in a timeline. Extends ITimeline.
 */
export interface IClips extends ITimeline {
  /**
   * Corresponds to the `Clip` element in DAWProject.xsd.
   * An array of clips.
   */
  clips: IClip[];
}

/**
 * Corresponds to the `clipSlot` complex type in DAWProject.xsd.
 * Represents a slot in a timeline that can contain a clip. Extends ITimeline.
 */
export interface IClipSlot extends ITimeline {
  /**
   * Corresponds to the `track` attribute in DAWProject.xsd.
   * Reference to the track this clip slot belongs to.
   */
  track?: ITrack;
  /**
   * Corresponds to the `hasStop` attribute in DAWProject.xsd.
   * Indicates if the clip slot has a stop button/behavior.
   */
  hasStop?: boolean;
  /**
   * Corresponds to the `Clip` element in DAWProject.xsd.
   * The clip contained in the clip slot.
   */
  clip?: IClip;
}

/**
 * Corresponds to the `lanes` complex type in DAWProject.xsd.
 * Represents a collection of lanes in a timeline. Extends ITimeline.
 */
export interface ILanes extends ITimeline {
  /**
   * Corresponds to the choice of timeline elements within lanes in DAWProject.xsd.
   * An array of timelines (which can be other Lanes, Clips, Notes, etc.).
   */
  lanes: ITimeline[]; // Can contain other Lanes, Clips, Notes, Audio, Video, Points, ClipSlot etc.
}

// Device Interfaces

/**
 * Corresponds to the `device` complex type in DAWProject.xsd.
 * Base interface for all devices. Extends IReferenceable.
 */
export interface IDevice extends IReferenceable {
  /**
   * Corresponds to the `deviceRole` attribute in DAWProject.xsd.
   * The role of the device (e.g., instrument, audioFX).
   */
  deviceRole: DeviceRole;
  /**
   * Corresponds to the `deviceName` attribute in DAWProject.xsd.
   * The name of the device.
   */
  deviceName: string;
  /**
   * Corresponds to the `deviceID` attribute in DAWProject.xsd.
   * A unique identifier for the device type.
   */
  deviceID?: string;
  /**
   * Corresponds to the `deviceVendor` attribute in DAWProject.xsd.
   * The vendor of the device.
   */
  deviceVendor?: string;
  /**
   * Corresponds to the `loaded` attribute in DAWProject.xsd.
   * Indicates if the device was successfully loaded.
   */
  loaded?: boolean;
  /**
   * Corresponds to the `Enabled` element in DAWProject.xsd.
   * Parameter controlling the enabled state of the device.
   */
  enabled?: IBoolParameter;
  /**
   * Corresponds to the `State` element in DAWProject.xsd.
   * Reference to a file containing the device's state.
   */
  state?: IFileReference;
  /**
   * Corresponds to the `Parameters` element in DAWProject.xsd.
   * An array of parameters for the device.
   */
  parameters: IParameter[];
}

/**
 * Corresponds to the abstract `plugin` complex type in DAWProject.xsd.
 * Base interface for all plugin devices. Extends IDevice.
 */
export interface IPlugin extends IDevice {
  /**
   * Corresponds to the `pluginVersion` attribute in DAWProject.xsd.
   * The version of the plugin.
   */
  pluginVersion?: string;
}

/**
 * Corresponds to the `vst2Plugin` complex type in DAWProject.xsd.
 * Represents a VST2 plugin device. Extends IPlugin.
 */
export interface IVst2Plugin extends IPlugin {}

/**
 * Corresponds to the `vst3Plugin` complex type in DAWProject.xsd.
 * Represents a VST3 plugin device. Extends IPlugin.
 */
export interface IVst3Plugin extends IPlugin {}

/**
 * Corresponds to the `clapPlugin` complex type in DAWProject.xsd.
 * Represents a CLAP plugin device. Extends IPlugin.
 */
export interface IClapPlugin extends IPlugin {}

/**
 * Corresponds to the `auPlugin` complex type in DAWProject.xsd.
 * Represents an Audio Unit plugin device. Extends IPlugin.
 */
export interface IAuPlugin extends IPlugin {}

/**
 * Corresponds to the `builtinDevice` complex type in DAWProject.xsd.
 * Base interface for all built-in devices. Extends IDevice.
 */
export interface IBuiltInDevice extends IDevice {}

/**
 * Corresponds to the `equalizer` complex type in DAWProject.xsd.
 * Represents a built-in equalizer device. Extends IBuiltInDevice.
 */
export interface IEqualizer extends IBuiltInDevice {
  /**
   * Corresponds to the `Band` element in DAWProject.xsd.
   * An array of equalizer bands.
   */
  bands: IEqBand[];
  /**
   * Corresponds to the `InputGain` element in DAWProject.xsd.
   * Parameter controlling the input gain.
   */
  inputGain?: IRealParameter;
  /**
   * Corresponds to the `OutputGain` element in DAWProject.xsd.
   * Parameter controlling the output gain.
   */
  outputGain?: IRealParameter;
}

/**
 * Corresponds to the `eqBand` complex type in DAWProject.xsd.
 * Represents a single band in an equalizer device.
 */
export interface IEqBand {
  /**
   * Corresponds to the `type` attribute in DAWProject.xsd.
   * The type of the EQ band (e.g., highPass, bell).
   */
  type: EqBandType;
  /**
   * Corresponds to the `order` attribute in DAWProject.xsd.
   * The order of the band within the equalizer.
   */
  order?: number;
  /**
   * Corresponds to the `Enabled` element in DAWProject.xsd.
   * Parameter controlling the enabled state of the band.
   */
  enabled?: IBoolParameter;
  /**
   * Corresponds to the `Freq` element in DAWProject.xsd.
   * Parameter controlling the frequency of the band.
   */
  freq: IRealParameter;
  /**
   * Corresponds to the `Gain` element in DAWProject.xsd.
   * Parameter controlling the gain of the band.
   */
  gain?: IRealParameter;
  /**
   * Corresponds to the `Q` element in DAWProject.xsd.
   * Parameter controlling the Q factor (bandwidth) of the band.
   */
  quality?: IRealParameter;
}

/**
 * Corresponds to the `compressor` complex type in DAWProject.xsd.
 * Represents a built-in compressor device. Extends IBuiltInDevice.
 */
export interface ICompressor extends IBuiltInDevice {
  /**
   * Corresponds to the `Threshold` element in DAWProject.xsd.
   * Parameter controlling the threshold.
   */
  threshold?: IRealParameter;
  /**
   * Corresponds to the `Ratio` element in DAWProject.xsd.
   * Parameter controlling the ratio.
   */
  ratio?: IRealParameter;
  /**
   * Corresponds to the `Attack` element in DAWProject.xsd.
   * Parameter controlling the attack time.
   */
  attack?: IRealParameter;
  /**
   * Corresponds to the `Release` element in DAWProject.xsd.
   * Parameter controlling the release time.
   */
  release?: IRealParameter;
  /**
   * Corresponds to the `InputGain` element in DAWProject.xsd.
   * Parameter controlling the input gain.
   */
  inputGain?: IRealParameter;
  /**
   * Corresponds to the `OutputGain` element in DAWProject.xsd.
   * Parameter controlling the output gain.
   */
  outputGain?: IRealParameter;
  /**
   * Corresponds to the `Knee` element in DAWProject.xsd.
   * Parameter controlling the knee type. (Note: XSD does not explicitly define Knee, inferring from common compressor parameters)
   */
  knee?: IRealParameter;
  /**
   * Corresponds to the `AutoMakeup` element in DAWProject.xsd.
   * Parameter controlling auto makeup gain.
   */
  autoMakeup?: IBoolParameter;
  /**
   * Corresponds to the `SidechainInput` element in DAWProject.xsd.
   * Reference to another element for sidechain input. (Note: XSD does not explicitly define SidechainInput, inferring from common compressor parameters)
   */
  sidechainInput?: IReferenceable; // Reference to another element
}

/**
 * Corresponds to the `noiseGate` complex type in DAWProject.xsd.
 * Represents a built-in noise gate device. Extends IBuiltInDevice.
 */
export interface INoiseGate extends IBuiltInDevice {
  /**
   * Corresponds to the `Threshold` element in DAWProject.xsd.
   * Parameter controlling the threshold.
   */
  threshold?: IRealParameter;
  /**
   * Corresponds to the `Ratio` element in DAWProject.xsd.
   * Parameter controlling the ratio.
   */
  ratio?: IRealParameter;
  /**
   * Corresponds to the `Attack` element in DAWProject.xsd.
   * Parameter controlling the attack time.
   */
  attack?: IRealParameter;
  /**
   * Corresponds to the `Release` element in DAWProject.xsd.
   * Parameter controlling the release time.
   */
  release?: IRealParameter;
  /**
   * Corresponds to the `Range` element in DAWProject.xsd.
   * Parameter controlling the range.
   */
  range?: IRealParameter;
}

/**
 * Corresponds to the `limiter` complex type in DAWProject.xsd.
 * Represents a built-in limiter device. Extends IBuiltInDevice.
 */
export interface ILimiter extends IBuiltInDevice {
  /**
   * Corresponds to the `Threshold` element in DAWProject.xsd.
   * Parameter controlling the threshold.
   */
  threshold?: IRealParameter;
  /**
   * Corresponds to the `Attack` element in DAWProject.xsd.
   * Parameter controlling the attack time.
   */
  attack?: IRealParameter;
  /**
   * Corresponds to the `Release` element in DAWProject.xsd.
   * Parameter controlling the release time.
   */
  release?: IRealParameter;
  /**
   * Corresponds to the `InputGain` element in DAWProject.xsd.
   * Parameter controlling the input gain.
   */
  inputGain?: IRealParameter;
  /**
   * Corresponds to the `OutputGain` element in DAWProject.xsd.
   * Parameter controlling the output gain.
   */
  outputGain?: IRealParameter;
}

// Core Structure Interfaces

/**
 * Corresponds to the abstract `lane` complex type in DAWProject.xsd.
 * Base interface for elements that represent a lane in the project structure (e.g., Track, Channel). Extends IReferenceable.
 */
export interface ILane extends IReferenceable {}

/**
 * Corresponds to the `send` complex type in DAWProject.xsd.
 * Represents a send from a channel to a destination. Extends IReferenceable.
 */
export interface ISend extends IReferenceable {
  /**
   * Corresponds to the `type` attribute in DAWProject.xsd.
   * The type of send (e.g., pre, post).
   */
  type?: SendType;
  /**
   * Corresponds to the `destination` attribute in DAWProject.xsd.
   * Reference to the destination channel of the send.
   */
  destination?: IReferenceable; // Reference to another element
  /**
   * Corresponds to the `Volume` element in DAWProject.xsd.
   * Parameter controlling the send volume.
   */
  volume?: IRealParameter;
  /**
   * Corresponds to the `Pan` element in DAWProject.xsd.
   * Parameter controlling the send pan.
   */
  pan?: IRealParameter;
}

/**
 * Corresponds to the `channel` complex type in DAWProject.xsd.
 * Represents a mixer channel. Extends ILane.
 */
export interface IChannel extends ILane {
  /**
   * Corresponds to the `role` attribute in DAWProject.xsd.
   * The role of the channel (e.g., regular, master).
   */
  role?: MixerRole;
  /**
   * Corresponds to the `audioChannels` attribute in DAWProject.xsd.
   * The number of audio channels for this mixer channel.
   */
  audioChannels?: number;
  /**
   * Corresponds to the `solo` attribute in DAWProject.xsd.
   * Indicates if the channel is soloed.
   */
  solo?: boolean;
  /**
   * Corresponds to the `destination` attribute in DAWProject.xsd.
   * Reference to the destination channel (e.g., a master or submix channel).
   */
  destination?: IChannel; // Recursive reference
  /**
   * Corresponds to the `Volume` element in DAWProject.xsd.
   * Parameter controlling the channel volume.
   */
  volume?: IRealParameter;
  /**
   * Corresponds to the `Pan` element in DAWProject.xsd.
   * Parameter controlling the channel pan.
   */
  pan?: IRealParameter;
  /**
   * Corresponds to the `Mute` element in DAWProject.xsd.
   * Parameter controlling the channel mute state.
   */
  mute?: IBoolParameter;
  /**
   * Corresponds to the `Sends` element in DAWProject.xsd.
   * An array of sends from this channel.
   */
  sends: ISend[];
  /**
   * Corresponds to the `Devices` element in DAWProject.xsd.
   * An array of devices on this channel.
   */
  devices: IDevice[];
}

/**
 * Corresponds to the `track` complex type in DAWProject.xsd.
 * Represents a track in the project. Extends ILane.
 */
export interface ITrack extends ILane {
  /**
   * Corresponds to the `contentType` attribute in DAWProject.xsd.
   * The type of content this track can hold (e.g., audio, notes).
   */
  contentType?: ContentType[];
  /**
   * Corresponds to the `loaded` attribute in DAWProject.xsd.
   * Indicates if the track was successfully loaded.
   */
  loaded?: boolean;
  /**
   * Corresponds to the `Channel` element in DAWProject.xsd.
   * The mixer channel associated with this track.
   */
  channel?: IChannel;
  /**
   * Corresponds to the `Track` element in DAWProject.xsd.
   * Child tracks nested within this track.
   */
  tracks?: ITrack[]; // Recursive reference
}

// Top-Level Interfaces

/**
 * Corresponds to the `application` complex type in DAWProject.xsd.
 * Represents the application that created the project.
 */
export interface IApplication {
  /**
   * Corresponds to the `name` attribute in DAWProject.xsd.
   * The name of the application.
   */
  name: string;
  /**
   * Corresponds to the `version` attribute in DAWProject.xsd.
   * The version of the application.
   */
  version: string;
}

/**
 * Corresponds to the `transport` complex type in DAWProject.xsd.
 * Represents the transport section of the project.
 */
export interface ITransport {
  /**
   * Corresponds to the `Tempo` element in DAWProject.xsd.
   * Parameter controlling the project tempo.
   */
  tempo?: IRealParameter;
  /**
   * Corresponds to the `TimeSignature` element in DAWProject.xsd.
   * Parameter controlling the project time signature.
   */
  timeSignature?: ITimeSignatureParameter;
}

/**
 * Corresponds to the `arrangement` complex type in DAWProject.xsd.
 * Represents the arrangement view of the project. Extends IReferenceable.
 */
export interface IArrangement extends IReferenceable {
  /**
   * Corresponds to the `Lanes` element in DAWProject.xsd.
   * The top-level lanes in the arrangement.
   */
  lanes?: ILanes;
  /**
   * Corresponds to the `Markers` element in DAWProject.xsd.
   * Markers in the arrangement timeline.
   */
  markers?: IMarkers;
  /**
   * Corresponds to the `TempoAutomation` element in DAWProject.xsd.
   * Automation timeline for tempo.
   */
  tempoAutomation?: IPoints;
  /**
   * Corresponds to the `TimeSignatureAutomation` element in DAWProject.xsd.
   * Automation timeline for time signature.
   */
  timeSignatureAutomation?: IPoints;
}

/**
 * Corresponds to the `scene` complex type in DAWProject.xsd.
 * Represents a scene in the project. Extends IReferenceable.
 */
export interface IScene extends IReferenceable {
  /**
   * Corresponds to the choice of timeline elements within a scene in DAWProject.xsd.
   * The content of the scene (typically Lanes -> ClipSlot -> Clip).
   */
  content?: ITimeline; // Typically contains Lanes -> ClipSlot -> Clip
}

/**
 * Corresponds to the `project` complex type in DAWProject.xsd.
 * The root element of a DAW Project file.
 */
export interface IProject {
  /**
   * Corresponds to the `version` attribute in DAWProject.xsd.
   * The version of the DAW Project schema used.
   */
  version: string;
  /**
   * Corresponds to the `Application` element in DAWProject.xsd.
   * Information about the application that created the project.
   */
  application: IApplication;
  /**
   * Corresponds to the `Transport` element in DAWProject.xsd.
   * The transport section of the project.
   */
  transport?: ITransport;
  /**
   * Corresponds to the `Structure` element in DAWProject.xsd.
   * The main structural elements of the project (Tracks and Channels).
   */
  structure?: ILane[]; // Array of Track, Channel, etc.
  /**
   * Corresponds to the `Arrangement` element in DAWProject.xsd.
   * The arrangement view of the project.
   */
  arrangement?: IArrangement;
  /**
   * Corresponds to the `Scenes` element in DAWProject.xsd.
   * An array of scenes in the project.
   */
  scenes?: IScene[];
}

/**
 * Corresponds to the `metaData` complex type in MetaData.xsd.
 * Contains metadata about the project.
 */
export interface IMetaData {
  /**
   * Corresponds to the `Title` element in MetaData.xsd.
   * The title of the project.
   */
  title?: string;
  /**
   * Corresponds to the `Artist` element in MetaData.xsd.
   * The artist of the project.
   */
  artist?: string;
  /**
   * Corresponds to the `Album` element in MetaData.xsd.
   * The album the project belongs to.
   */
  album?: string;
  /**
   * Corresponds to the `OriginalArtist` element in MetaData.xsd.
   * The original artist of the material.
   */
  originalArtist?: string;
  /**
   * Corresponds to the `Composer` element in MetaData.xsd.
   * The composer of the project.
   */
  composer?: string;
  /**
   * Corresponds to the `Songwriter` element in MetaData.xsd.
   * The songwriter of the project.
   */
  songwriter?: string;
  /**
   * Corresponds to the `Producer` element in MetaData.xsd.
   * The producer of the project.
   */
  producer?: string;
  /**
   * Corresponds to the `Arranger` element in MetaData.xsd.
   * The arranger of the project.
   */
  arranger?: string;
  /**
   * Corresponds to the `Year` element in MetaData.xsd.
   * The year of the project.
   */
  year?: string;
  /**
   * Corresponds to the `Genre` element in MetaData.xsd.
   * The genre of the project.
   */
  genre?: string;
  /**
   * Corresponds to the `Copyright` element in MetaData.xsd.
   * The copyright information for the project.
   */
  copyright?: string;
  /**
   * Corresponds to the `Website` element in MetaData.xsd.
   * A website related to the project.
   */
  website?: string;
  /**
   * Corresponds to the `Comment` element in MetaData.xsd.
   * General comments about the project.
   */
  comment?: string;
}
