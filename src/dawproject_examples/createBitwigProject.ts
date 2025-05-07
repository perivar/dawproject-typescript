import { Application } from "../dawproject/application";
import { Arrangement } from "../dawproject/arrangement";
import { BoolParameter } from "../dawproject/boolParameter";
import { ContentType } from "../dawproject/contentType";
import { Compressor } from "../dawproject/device/compressor";
import { DeviceRole } from "../dawproject/device/deviceRole";
import { EqBand } from "../dawproject/device/eqBand";
import { EqBandType } from "../dawproject/device/eqBandType";
import { Equalizer } from "../dawproject/device/equalizer";
import { FileReference } from "../dawproject/fileReference";
import { MixerRole } from "../dawproject/mixerRole";
import { Project } from "../dawproject/project";
import { RealParameter } from "../dawproject/realParameter";
import { Referenceable } from "../dawproject/referenceable";
import { Lanes } from "../dawproject/timeline/lanes";
import { TimeUnit } from "../dawproject/timeline/timeUnit";
import { Transport } from "../dawproject/transport";
import { Unit } from "../dawproject/unit";
import { Utility } from "../dawproject/utility";

export interface AudioTrackConfig {
  file_path: string;
  sample_duration: number;
  gain: number;
  pan: number;
  eq_settings?: {
    frequency: number;
    gain: number;
    q: number;
    enabled: boolean;
    band_type: EqBandType;
  }[];
  compressor_settings?: {
    threshold: number;
    ratio: number;
    attack: number;
    release: number;
    input_gain: number;
    output_gain: number;
    auto_makeup: boolean;
  };
}

function createEmptyProject(): Project {
  Referenceable.resetIdCounter();
  const project = new Project();
  project.application = new Application("RoEx Automix", "1.0");
  return project;
}

/**
 * Create a DAW project with the provided audio tracks, each with its gain, panning, EQ, and compressor settings.
 *
 * @param audioTracks List of dictionaries where each dictionary contains the following keys:
 *   - 'file_path': The location of the audio file.
 *   - 'sample_duration': The duration of the audio sample in seconds.
 *   - 'gain': The gain setting for the track (in dB).
 *   - 'pan': The panning setting for the track (range -1.0 to 1.0).
 *   - 'eq_settings': List of dictionaries with EQ band settings. Each dictionary should contain:
 *       - 'frequency': The frequency of the EQ band (in Hz).
 *       - 'gain': The gain for the EQ band (in dB).
 *       - 'q': The Q factor for the EQ band.
 *       - 'enabled': Boolean to enable/disable the EQ band.
 *       - 'band_type': Type of EQ band (e.g., 'bell', 'high_shelf', etc.).
 *   - 'compressor_settings': Dictionary with compressor settings:
 *       - 'threshold': Threshold (in dB).
 *       - 'ratio': Compression ratio.
 *       - 'attack': Attack time (in seconds).
 *       - 'release': Release time (in seconds).
 *       - 'input_gain': Input gain (in dB).
 *       - 'output_gain': Output gain (in dB).
 *       - 'auto_makeup': Boolean to enable/disable automatic makeup gain.
 */
export function createProjectWithAudioTracks(
  audioTracks: AudioTrackConfig[]
): Project {
  const project = createEmptyProject();
  project.transport = new Transport();
  project.transport.tempo = new RealParameter(120.0, Unit.BPM);

  const masterTrack = Utility.createTrack(
    "Master",
    new Set(),
    MixerRole.MASTER,
    1.0,
    0.5
  );
  project.structure.push(masterTrack);
  project.arrangement = new Arrangement();
  project.arrangement.lanes = new Lanes();
  project.arrangement.lanes.timeUnit = TimeUnit.SECONDS;

  audioTracks.forEach((trackInfo, i) => {
    // Create audio track
    const trackName = trackInfo.file_path.split("/").pop() || `Track_${i + 1}`;
    const audioTrack = Utility.createTrack(
      trackName,
      new Set([ContentType.AUDIO]),
      MixerRole.REGULAR,
      trackInfo.gain,
      trackInfo.pan
    );
    // Assuming masterTrack.channel is not undefined
    if (masterTrack.channel) {
      audioTrack.channel!.destination = masterTrack.channel;
    }
    project.structure.push(audioTrack);

    // Load audio file
    const sampleDuration = trackInfo.sample_duration;
    const audio = Utility.createAudio(
      trackName, // Use trackName as the path within the DAWproject
      44100,
      2,
      sampleDuration
    );
    audio.file = new FileReference(trackName, true); // external file

    // Create and add clip to the track
    const audioClip = Utility.createClip(audio, 0, sampleDuration);
    audioClip.contentTimeUnit = TimeUnit.SECONDS;
    audioClip.playStart = 0;

    const clips = Utility.createClips(audioClip);
    clips.track = audioTrack;

    // Add clips to arrangement lanes
    // The commented out lines below are from the Python example but not needed in the TS structure
    // track_lanes = Lanes()
    // track_lanes.lanes.append(clips)
    project.arrangement!.lanes!.lanes.push(clips);

    // Apply EQ settings
    if (trackInfo.eq_settings && audioTrack.channel) {
      const eqBands: EqBand[] = [];
      trackInfo.eq_settings.forEach(eqBandInfo => {
        const eqBand = new EqBand(
          eqBandInfo.band_type,
          new RealParameter(eqBandInfo.frequency, Unit.HERTZ),
          new RealParameter(eqBandInfo.gain, Unit.DECIBEL),
          new RealParameter(eqBandInfo.q, Unit.LINEAR),
          new BoolParameter(eqBandInfo.enabled)
          // order is optional
        );
        eqBands.push(eqBand);
      });
      const equalizer = new Equalizer(
        DeviceRole.AUDIO_FX,
        `Eq_${i + 1}`,
        eqBands
        // input_gain, output_gain are optional
      );
      audioTrack.channel.devices.push(equalizer);
    }

    // Apply Compressor settings
    if (trackInfo.compressor_settings && audioTrack.channel) {
      const compInfo = trackInfo.compressor_settings;
      const compressor = new Compressor(
        DeviceRole.AUDIO_FX,
        `Compressor_${i + 1}`,
        new RealParameter(compInfo.threshold, Unit.DECIBEL),
        new RealParameter(compInfo.ratio, Unit.PERCENT),
        new RealParameter(compInfo.attack, Unit.SECONDS),
        new RealParameter(compInfo.release, Unit.SECONDS),
        new RealParameter(compInfo.input_gain, Unit.DECIBEL),
        new RealParameter(compInfo.output_gain, Unit.DECIBEL),
        new BoolParameter(compInfo.auto_makeup) // Create BoolParameter instance
      );
      audioTrack.channel.devices.push(compressor);
    }
  });

  return project;
}
