import fs from "fs";
import path from "path";

import { EqBandType } from "../../dawproject/device/eqBandType";
import { Project } from "../../dawproject/project";
import { XmlObject } from "../../dawproject/XmlObject";
import {
  AudioTrackConfig,
  createProjectWithAudioTracks,
} from "../createBitwigProject";

// const targetDir = path.join(os.tmpdir(), "dawproject-tests");
const targetDir = path.join(__dirname, "dawproject-tests");

describe("createBitwigProject", () => {
  test("should serialize and deserialize a BitwigProject", () => {
    const audioTracks: AudioTrackConfig[] = [
      {
        file_path: "./audio_in/masks-bass.wav",
        sample_duration: 30,
        gain: 0.7,
        pan: 0.5,
        eq_settings: [
          {
            frequency: 100,
            gain: 6,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.BELL,
          },
          {
            frequency: 1000,
            gain: -3,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.HIGH_SHELF,
          },
        ],
        compressor_settings: {
          threshold: -15,
          ratio: 0.5,
          attack: 0.01,
          release: 0.2,
          input_gain: 0.0,
          output_gain: 0.0,
          auto_makeup: true,
        },
      },
      {
        file_path: "./audio_in/masks-chord.wav",
        sample_duration: 30,
        gain: 0.9,
        pan: 0.7,
        eq_settings: [
          {
            frequency: 100,
            gain: 6,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.BELL,
          },
          {
            frequency: 1000,
            gain: -3,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.HIGH_SHELF,
          },
        ],
        compressor_settings: {
          threshold: -15,
          ratio: 0.5,
          attack: 0.01,
          release: 0.2,
          input_gain: 0.0,
          output_gain: 0.0,
          auto_makeup: true,
        },
      },
      {
        file_path: "./audio_in/masks-kick.wav",
        sample_duration: 30,
        gain: 0.2,
        pan: 0.5,
        eq_settings: [
          {
            frequency: 100,
            gain: 6,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.BELL,
          },
          {
            frequency: 1000,
            gain: -3,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.HIGH_SHELF,
          },
        ],
        compressor_settings: {
          threshold: -15,
          ratio: 0.3,
          attack: 0.01,
          release: 0.2,
          input_gain: 0.0,
          output_gain: 0.0,
          auto_makeup: true,
        },
      },
      {
        file_path: "./audio_in/masks-percussion.wav",
        sample_duration: 30,
        gain: 0.7,
        pan: 0.5,
        eq_settings: [
          {
            frequency: 100,
            gain: 6,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.BELL,
          },
          {
            frequency: 1000,
            gain: -3,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.HIGH_SHELF,
          },
        ],
        compressor_settings: {
          threshold: -5,
          ratio: 0.2,
          attack: 0.01,
          release: 0.2,
          input_gain: 0.0,
          output_gain: 0.0,
          auto_makeup: true,
        },
      },
      {
        file_path: "./audio_in/masks-synth.wav",
        sample_duration: 30,
        gain: 0.4,
        pan: 0.2,
        eq_settings: [
          {
            frequency: 100,
            gain: 6,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.BELL,
          },
          {
            frequency: 1000,
            gain: -3,
            q: 1.0,
            enabled: true,
            band_type: EqBandType.HIGH_SHELF,
          },
        ],
        compressor_settings: {
          threshold: -35,
          ratio: 0.7,
          attack: 0.01,
          release: 0.2,
          input_gain: 0.0,
          output_gain: 0.0,
          auto_makeup: true,
        },
      },
      // Add more tracks here
    ];

    const project = createProjectWithAudioTracks(audioTracks);

    fs.writeFileSync(
      path.join(targetDir, "dawproject_bitwig_serialized.json"),
      JSON.stringify(project, null, 2)
    );

    const projectXml = project.toXml();

    fs.writeFileSync(
      path.join(targetDir, "dawproject_bitwig_serialized.xml"),
      projectXml
    );

    // Check if the returned object is an instance of Project
    expect(project).toBeInstanceOf(Project);

    const loadedProject = XmlObject.fromXml(projectXml, Project);

    fs.writeFileSync(
      path.join(targetDir, "dawproject_bitwig_deserialized.json"),
      JSON.stringify(loadedProject, null, 2)
    );

    // Deep comparison to check if the loaded project is equivalent to the original
    expect(loadedProject).toEqual(project);
  });
});
