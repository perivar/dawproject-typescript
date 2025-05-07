import fs from "fs";
import path from "path";

import { ContentType } from "../../dawproject/contentType";
import { DawProject } from "../../dawproject/dawProject";
import { ExpressionType } from "../../dawproject/expressionType";
import { Interpolation } from "../../dawproject/interpolation";
import { MetaData } from "../../dawproject/metaData";
import { Project } from "../../dawproject/project";
import { Referenceable } from "../../dawproject/referenceable";
import { Lanes } from "../../dawproject/timeline/lanes";
import { Points } from "../../dawproject/timeline/points";
import { RealPoint } from "../../dawproject/timeline/realPoint";
import { TimeUnit } from "../../dawproject/timeline/timeUnit";
import { Track } from "../../dawproject/track";
import { Unit } from "../../dawproject/unit";
import { XmlObject } from "../../dawproject/XmlObject";
import {
  createDummyProject,
  createMIDIAutomationExample,
  Features,
} from "../createExampleProject";

const simpleFeatures = new Set<Features>(["CLIPS", "NOTES", "AUDIO"]);
// const targetDir = path.join(os.tmpdir(), "dawproject-tests");
const targetDir = path.join(__dirname, "dawproject-tests");

beforeAll(() => {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
});

beforeEach(() => {
  Referenceable.resetIdCounter();
});

afterAll(() => {
  // if (fs.existsSync(targetDir)) {
  //   fs.rmSync(targetDir, { recursive: true, force: true });
  // }
});

describe("DAW Project", () => {
  test("should create basic project", () => {
    const project = createDummyProject(3, simpleFeatures);

    const projectXml = project.toXml();
    fs.writeFileSync(
      path.join(targetDir, "dawproject_dummy_basic.xml"),
      projectXml
    );

    expect(project).toBeDefined();
    expect(project.structure.length).toBe(4); // 3 tracks + master
    expect(project.arrangement).toBeDefined();
  });

  test("should have master track", () => {
    const project = createDummyProject(1, simpleFeatures);

    const projectXml = project.toXml();
    fs.writeFileSync(
      path.join(targetDir, "dawproject_dummy_master.xml"),
      projectXml
    );

    const masterTrack = project.structure[0] as Track;
    expect(masterTrack.name).toBe("Master");
    expect(masterTrack.channel).toBeDefined();
  });

  test("should handle all features", () => {
    const project = createDummyProject(
      3,
      new Set<Features>([
        "CUE_MARKERS",
        "CLIPS",
        "AUDIO",
        "NOTES",
        "AUTOMATION",
        "ALIAS_CLIPS",
        "PLUGINS",
      ])
    );

    const projectXml = project.toXml();
    fs.writeFileSync(
      path.join(targetDir, "dawproject_dummy_all.xml"),
      projectXml
    );

    // Verify arrangement exists
    expect(project.arrangement).toBeDefined();

    if (project.arrangement) {
      // Check markers
      expect(project.arrangement.markers).toBeDefined();
      expect(project.arrangement.markers?.markers.length).toBe(2);
    }

    // Check master track plugins
    const masterTrack = project.structure[0] as Track;
    expect(masterTrack.channel?.devices).toBeDefined();
    expect(masterTrack.channel?.devices?.length).toBeGreaterThan(0);

    // Check track routing
    const regularTrack = project.structure[1] as Track;
    expect(regularTrack.channel?.destination).toBe(masterTrack.channel);
  });

  test("should create correct track structure", () => {
    const project = createDummyProject(2, simpleFeatures);

    // Check track count
    expect(project.structure.length).toBe(3); // 2 tracks + master

    // Check track names
    const tracks = project.structure as Track[];
    expect(tracks[0].name).toBe("Master");
    expect(tracks[1].name).toBe("Track 1");
    expect(tracks[2].name).toBe("Track 2");

    // Check arrangement
    expect(project.arrangement?.lanes?.timeUnit).toBe(TimeUnit.BEATS);
  });

  test("should create correct lane content", () => {
    const project = createDummyProject(
      1,
      new Set<Features>(["CLIPS", "NOTES"])
    );

    const projectXml = project.toXml();
    fs.writeFileSync(
      path.join(targetDir, "dawproject_dummy_clips_notes.xml"),
      projectXml
    );

    const tracks = project.structure;
    expect(tracks.length).toBeGreaterThan(0);

    // Find track with notes capability
    const notesTrack = tracks.find(track => {
      if (track instanceof Track) {
        return track.contentType.includes(ContentType.NOTES);
      }
      return false;
    }) as Track | undefined;

    expect(notesTrack).toBeDefined();
    expect(notesTrack?.contentType).toContain(ContentType.NOTES);
  });

  test("should create automation points", () => {
    const project = createDummyProject(1, new Set<Features>(["AUTOMATION"]));

    const projectXml = project.toXml();
    fs.writeFileSync(
      path.join(targetDir, "dawproject_dummy_automation.xml"),
      projectXml
    );

    if (project.arrangement?.lanes) {
      const trackLanes = project.arrangement.lanes.lanes;

      // Find the track's lanes (assuming it's the first Lanes instance in arrangementLanes.lanes)
      const trackLanesInstance = trackLanes.find(
        lane => lane instanceof Lanes
      ) as Lanes | undefined;

      expect(trackLanesInstance).toBeDefined();

      if (trackLanesInstance) {
        // Find automation points lane within the track's lanes
        const pointsLane = trackLanesInstance.lanes.find(
          lane => lane instanceof Points
        );

        expect(pointsLane).toBeDefined();
        expect(pointsLane instanceof Points).toBe(true);
      }
    }
  });

  test("should serialize and deserialize a simple project via XML", () => {
    const project = createDummyProject(2, simpleFeatures);

    fs.writeFileSync(
      path.join(targetDir, "dawproject_simple_serialized.json"),
      JSON.stringify(project, null, 2)
    );

    const projectXml = project.toXml();

    fs.writeFileSync(
      path.join(targetDir, "dawproject_simple_serialized.xml"),
      projectXml
    );

    const loadedProject = XmlObject.fromXml(projectXml, Project);

    fs.writeFileSync(
      path.join(targetDir, "dawproject_simple_deserialized.json"),
      JSON.stringify(loadedProject, null, 2)
    );

    // Deep comparison to check if the loaded project is equivalent to the original
    expect(loadedProject).toEqual(project);
  });

  test("should serialize and deserialize a complex project via XML", () => {
    const complexFeatures = new Set<Features>([
      "CUE_MARKERS",
      "CLIPS",
      "AUDIO",
      "NOTES",
      "AUTOMATION",
      "ALIAS_CLIPS",
      "PLUGINS",
    ]);
    const project = createDummyProject(3, complexFeatures);

    fs.writeFileSync(
      path.join(targetDir, "dawproject_complex_serialized.json"),
      JSON.stringify(project, null, 2)
    );

    const projectXml = project.toXml();

    fs.writeFileSync(
      path.join(targetDir, "dawproject_complex_serialized.xml"),
      projectXml
    );

    const loadedProject = XmlObject.fromXml(projectXml, Project);

    fs.writeFileSync(
      path.join(targetDir, "dawproject_complex_deserialized.json"),
      JSON.stringify(loadedProject, null, 2)
    );

    // Deep comparison to check if the loaded project is equivalent to the original
    expect(loadedProject).toEqual(project);
  });
});

describe("MIDI Automation", () => {
  test("should create CC1 automation on track", () => {
    const project = createMIDIAutomationExample("CC1-Track", false, false);

    expect(project.structure.length).toBe(2); // master + instrument track
    expect(project.arrangement?.lanes?.timeUnit).toBe(TimeUnit.BEATS);

    const instrumentTrack = project.structure[1] as Track;
    expect(instrumentTrack.name).toBe("Notes");
    expect(instrumentTrack.contentType).toContain(ContentType.NOTES);

    const trackLanes = project.arrangement?.lanes?.lanes;
    expect(trackLanes).toBeDefined();
    if (trackLanes) {
      const automationLane = trackLanes.find(
        lane => lane instanceof Points
      ) as Points;
      expect(automationLane).toBeDefined();
      expect(automationLane.unit).toBe(Unit.NORMALIZED);

      // Check automation target
      const target = automationLane.target;
      expect(target).toBeDefined();
      expect(target.expression).toBe(ExpressionType.CHANNEL_CONTROLLER);
      expect(target.channel).toBe(0);
      expect((target as any).controller).toBe(1); // CC1

      // Check automation points
      expect(automationLane.points.length).toBe(9);
      expect(automationLane.track).toBe(instrumentTrack);
    }
  });

  test("should create pitch bend automation in clip", () => {
    const project = createMIDIAutomationExample("PitchBend-Clip", true, true);

    const instrumentTrack = project.structure[1] as Track;
    const trackLanes = project.arrangement?.lanes?.lanes;
    expect(trackLanes).toBeDefined();
    if (trackLanes) {
      // Find clips lane
      const clipsLane = trackLanes.find(lane => lane.track === instrumentTrack);
      expect(clipsLane).toBeDefined();

      // Check automation content in clip
      if (clipsLane) {
        const clip = (clipsLane as any).clips[0];
        expect(clip).toBeDefined();
        expect(clip.content).toBeDefined();
        expect(clip.content instanceof Points).toBe(true);

        const automation = clip.content as Points;
        expect(automation.target.expression).toBe(ExpressionType.PITCH_BEND);
        expect(automation.target.channel).toBe(0);
        expect(automation.points.length).toBe(9);
      }
    }
  });

  test("should create automation with correct points pattern", () => {
    const project = createMIDIAutomationExample("Points-Test", false, false);

    const trackLanes = project.arrangement?.lanes?.lanes;
    if (trackLanes) {
      const automationLane = trackLanes.find(
        lane => lane instanceof Points
      ) as Points;
      expect(automationLane).toBeDefined();

      const points = automationLane.points as RealPoint[];
      expect(points.length).toBe(9);

      // Check specific points
      expect(points[0].time).toBe(0);
      expect(points[0].value).toBe(0);

      expect(points[2].time).toBe(2);
      expect(points[2].value).toBe(0.5);

      expect(points[4].time).toBe(4);
      expect(points[4].value).toBe(1.0);

      // Check last two points use HOLD interpolation
      expect(points[7].interpolation).toBe(Interpolation.HOLD);
      expect(points[8].interpolation).toBe(Interpolation.HOLD);
    }
  });
});

describe("Save and Load", () => {
  test("should save and load DAW project with simple features", async () => {
    const project = createDummyProject(5, simpleFeatures);

    const metadata = new MetaData();
    const embeddedFiles: Record<string, Uint8Array> = {};

    // Save project
    const zipData = await DawProject.save(project, metadata, embeddedFiles);
    fs.writeFileSync(path.join(targetDir, "testfile.dawproject"), zipData);

    // Load project
    const loadData = fs.readFileSync(
      path.join(targetDir, "testfile.dawproject")
    );
    const loadedProject = await DawProject.loadProject(loadData);

    expect(loadedProject.structure.length).toBe(project.structure.length);
    expect(loadedProject.scenes?.length).toBe(project.scenes?.length);

    // Deep comparison to check if the loaded project is equivalent to the original
    expect(loadedProject).toEqual(project);
  });

  test("should save and load complex DAW project", async () => {
    const project = createDummyProject(
      5,
      new Set<Features>([
        "CUE_MARKERS",
        "CLIPS",
        "AUDIO",
        "NOTES",
        "AUTOMATION",
        "ALIAS_CLIPS",
        "PLUGINS",
      ])
    );
    const metadata = new MetaData();
    const embeddedFiles: Record<string, Uint8Array> = {};

    // Save project
    const zipData = await DawProject.save(project, metadata, embeddedFiles);
    fs.writeFileSync(path.join(targetDir, "testfile2.dawproject"), zipData);

    // Load project
    const loadData = fs.readFileSync(
      path.join(targetDir, "testfile2.dawproject")
    );
    const loadedProject = await DawProject.loadProject(loadData);

    // Check project structure
    expect(loadedProject.structure.length).toBe(project.structure.length);
    expect(loadedProject.scenes?.length).toBe(project.scenes?.length);

    // Check arrangement
    expect(loadedProject.arrangement?.lanes?.lanes?.length).toBe(
      project.arrangement?.lanes?.lanes?.length
    );
    expect(loadedProject.arrangement?.markers?.markers?.length).toBe(
      project.arrangement?.markers?.markers?.length
    );

    // Deep comparison to check if the loaded project is equivalent to the original
    expect(loadedProject).toEqual(project);
  });

  test("should save complex project with validation", async () => {
    const project = createDummyProject(
      3,
      new Set<Features>([
        "CUE_MARKERS",
        "CLIPS",
        "AUDIO",
        "NOTES",
        "AUTOMATION",
        "ALIAS_CLIPS",
        "PLUGINS",
      ])
    );
    const metadata = new MetaData();
    const embeddedFiles: Record<string, Uint8Array> = {};

    // Save project
    const zipData = await DawProject.save(project, metadata, embeddedFiles);
    fs.writeFileSync(path.join(targetDir, "test-complex.dawproject"), zipData);

    // Convert project to XML for validation
    const projectXml = project.toXml();
    fs.writeFileSync(
      path.join(targetDir, "test-complex.dawproject.xml"),
      projectXml
    );

    // Validate the XML (optional for Node.js environment)
    await DawProject.validate(project);
  });
});

export type { Features };
