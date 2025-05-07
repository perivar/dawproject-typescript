import { Application } from "../dawproject/application";
import { Arrangement } from "../dawproject/arrangement";
import { ContentType } from "../dawproject/contentType";
import { DeviceRole } from "../dawproject/device/deviceRole";
import { Vst3Plugin } from "../dawproject/device/vst3Plugin";
import { ExpressionType } from "../dawproject/expressionType";
import { FileReference } from "../dawproject/fileReference";
import { Interpolation } from "../dawproject/interpolation";
import { MixerRole } from "../dawproject/mixerRole";
import { Project } from "../dawproject/project";
import { RealParameter } from "../dawproject/realParameter";
import { Referenceable } from "../dawproject/referenceable";
import { AutomationTarget } from "../dawproject/timeline/automationTarget";
import { Clip } from "../dawproject/timeline/clip";
import { Clips } from "../dawproject/timeline/clips";
import { Lanes } from "../dawproject/timeline/lanes";
import { Marker } from "../dawproject/timeline/marker";
import { Markers } from "../dawproject/timeline/markers";
import { Note } from "../dawproject/timeline/note";
import { Notes } from "../dawproject/timeline/notes";
import { Points } from "../dawproject/timeline/points";
import { RealPoint } from "../dawproject/timeline/realPoint";
import { TimeUnit } from "../dawproject/timeline/timeUnit";
import { Transport } from "../dawproject/transport";
import { Unit } from "../dawproject/unit";
import { Utility } from "../dawproject/utility";

/** Available features for project creation */
export type Features =
  | "CUE_MARKERS"
  | "CLIPS"
  | "AUDIO"
  | "NOTES"
  | "AUTOMATION"
  | "ALIAS_CLIPS"
  | "PLUGINS";

/** Create an empty DAW project with basic settings */
function createEmptyProject(): Project {
  Referenceable.resetIdCounter();
  const project = new Project();
  project.application = new Application("Test", "1.0");
  return project;
}

/** Create a marker at the specified time with given name */
function createMarker(time: number, name: string): Marker {
  const markerEvent = new Marker(0);
  markerEvent.time = time;
  markerEvent.name = name;
  return markerEvent;
}

/** Create a real point with interpolation */
function createPoint(
  time: number,
  value: number,
  interpolation: Interpolation
): RealPoint {
  const point = new RealPoint(0, 0);
  point.time = time;
  point.value = value;
  point.interpolation = interpolation;
  return point;
}

/** Create a DAW project with the specified number of tracks and features */
export function createDummyProject(
  numTracks: number,
  features: Set<Features>
): Project {
  const project = createEmptyProject();

  project.transport = new Transport();
  project.transport.tempo = new RealParameter(120.0, Unit.BPM);

  // Create master track
  const masterTrack = Utility.createTrack(
    "Master",
    new Set<ContentType>(),
    MixerRole.MASTER,
    1.0,
    0.5
  );
  project.structure.push(masterTrack);

  // Add plugin to master if needed
  if (features.has("PLUGINS") && masterTrack.channel) {
    if (!masterTrack.channel.devices) {
      masterTrack.channel.devices = [];
    }

    const device = new Vst3Plugin();
    device.deviceName = "Limiter";
    device.deviceRole = DeviceRole.AUDIO_FX;
    device.state = new FileReference();
    device.state.path = "plugin-states/12323545.vstpreset";

    masterTrack.channel.devices.push(device);
  }

  // Setup arrangement
  project.arrangement = new Arrangement();
  const arrangementLanes = new Lanes();
  arrangementLanes.timeUnit = TimeUnit.BEATS;
  project.arrangement.lanes = arrangementLanes;

  // Add markers if needed
  if (features.has("CUE_MARKERS")) {
    const cueMarkers = new Markers();
    project.arrangement.markers = cueMarkers;
    cueMarkers.markers.push(createMarker(0, "Verse"));
    cueMarkers.markers.push(createMarker(24, "Chorus"));
  }

  // Create tracks
  for (let i = 0; i < numTracks; i++) {
    const track = Utility.createTrack(
      `Track ${i + 1}`,
      new Set([ContentType.NOTES]),
      MixerRole.REGULAR,
      1.0,
      0.5
    );
    project.structure.push(track);
    track.color = `#${i}${i}${i}${i}${i}${i}`;

    if (track.channel && masterTrack.channel) {
      track.channel.destination = masterTrack.channel;
    }

    const trackLanes = new Lanes();
    trackLanes.track = track;
    arrangementLanes.lanes.push(trackLanes);

    if (features.has("CLIPS")) {
      const clips = new Clips();
      trackLanes.lanes.push(clips);

      const clip = new Clip(0);
      clip.name = `Clip ${i}`;
      clip.time = 8 * i;
      clip.duration = 4.0;
      clips.clips.push(clip);

      const notes = new Notes();
      clip.content = notes;

      // Add notes
      for (let j = 0; j < 8; j++) {
        const note = new Note(0, 0, 0);
        note.key = 36 + 12 * (j % (1 + i));
        note.velocity = 0.8;
        note.releaseVelocity = 0.5;
        note.time = 0.5 * j;
        note.duration = 0.5;
        notes.notes.push(note);
      }

      // Add alias clip if needed
      if (features.has("ALIAS_CLIPS")) {
        const clip2 = new Clip(0);
        clip2.name = `Alias Clip ${i}`;
        clip2.time = 32 + 8 * i;
        clip2.duration = 4.0;
        clip2.reference = notes.id;
        clips.clips.push(clip2);
      }
    }

    // Add automation if needed for first track
    if (i === 0 && features.has("AUTOMATION") && track.channel?.volume) {
      const points = new Points();
      points.target.parameter = track.channel.volume;
      trackLanes.lanes.push(points);

      // Add fade-in automation points
      points.points.push(createPoint(0.0, 0.0, Interpolation.LINEAR));
      points.points.push(createPoint(8.0, 1.0, Interpolation.LINEAR));
    }
  }

  return project;
}

/**
 * Create a project with MIDI automation (CC1 or Pitch Bend) either in clips or directly on tracks.
 */
export function createMIDIAutomationExample(
  name: string,
  inClips: boolean,
  isPitchBend: boolean
): Project {
  const project = createEmptyProject();
  const masterTrack = Utility.createTrack(
    "Master",
    new Set<ContentType>(),
    MixerRole.MASTER,
    1.0,
    0.5
  );
  const instrumentTrack = Utility.createTrack(
    "Notes",
    new Set([ContentType.NOTES]),
    MixerRole.REGULAR,
    1.0,
    0.5
  );

  if (instrumentTrack.channel && masterTrack.channel) {
    instrumentTrack.channel.destination = masterTrack.channel;
  }

  project.structure.push(masterTrack);
  project.structure.push(instrumentTrack);

  project.arrangement = new Arrangement();
  project.transport = new Transport();
  project.transport.tempo = new RealParameter(123.0, Unit.BPM);

  const arrangementLanes = new Lanes();
  project.arrangement.lanes = arrangementLanes;
  project.arrangement.lanes.timeUnit = TimeUnit.BEATS;

  // Create automation points
  const automation = new Points();
  automation.unit = Unit.NORMALIZED;

  if (isPitchBend) {
    automation.target = new AutomationTarget(
      undefined,
      ExpressionType.PITCH_BEND,
      0
    );
  } else {
    automation.target = new AutomationTarget(
      undefined,
      ExpressionType.CHANNEL_CONTROLLER,
      0,
      undefined,
      1
    );
  }

  // Add automation points with various interpolation types
  automation.points.push(createPoint(0, 0.0, Interpolation.LINEAR));
  automation.points.push(createPoint(1, 0.0, Interpolation.LINEAR));
  automation.points.push(createPoint(2, 0.5, Interpolation.LINEAR));
  automation.points.push(createPoint(3, 0.5, Interpolation.LINEAR));
  automation.points.push(createPoint(4, 1.0, Interpolation.LINEAR));
  automation.points.push(createPoint(5, 1.0, Interpolation.LINEAR));
  automation.points.push(createPoint(6, 0.5, Interpolation.LINEAR));
  automation.points.push(createPoint(7, 1.0, Interpolation.HOLD));
  automation.points.push(createPoint(8, 0.5, Interpolation.HOLD));

  if (inClips) {
    const clip = Utility.createClip(automation, 0, 8);
    const clips = Utility.createClips(clip);
    clips.track = instrumentTrack;
    arrangementLanes.lanes.push(clips);
  } else {
    automation.track = instrumentTrack;
    arrangementLanes.lanes.push(automation);
  }

  return project;
}
