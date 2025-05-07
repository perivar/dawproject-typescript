# 🎵 DAWProject-Typescript

*TypeScript/JavaScript code for working with DAWProject files — enabling DAW interoperability.*

[![License](https://img.shields.io/github/license/perivar/dawproject-typescript)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/perivar/dawproject-typescript.svg)](https://github.com/perivar/dawproject-typescript/stargazers)

## 📖 About

DAWProject is an **open XML-based file format** designed for **seamless project exchange between DAWs**. It allows music producers, engineers, and developers to share **full session data** between different DAWs without losing important information.

The original **DAWProject** repository, developed by **Bitwig**, was written in **Java** (https://github.com/bitwig/dawproject). This repository provides a **TypeScript/JavaScript** implementation, enabling integration with web applications, Node.js environments, and other JavaScript-based projects. It is inspired by the original Java version and the Python port ([DAWProject-Py](https://github.com/roex-audio/dawproject-py)).

We **love the idea of DAWProject** and want to see it in **every DAW**. The more people building on it, the better—so we're making our **TypeScript version publicly available**. If anyone wants to **turn it into an npm package**, extend it, or modify it further, feel free!

## 📦 Installation

Since this is currently a **source-only library**, you can clone the repository and use it directly in your TypeScript/JavaScript project:

```sh
git clone https://github.com/perivar/dawproject-typescript.git
cd dawproject-ts
```

Install dependencies using npm or yarn:

```sh
npm install
# or
yarn install
```

Then, import it into your TypeScript/JavaScript project:

```typescript
import { DawProject, Project, Application, Track, Channel, RealParameter, Unit, ContentType, MixerRole, Utility } from './src/dawproject';
```
*(Note: Update the import path based on your project structure)*

## 🚀 Quick Start

### **Loading a DAWProject file (.dawproject container)**

```typescript
import { DawProject, Project } from './src/dawproject';
import * as fs from 'fs/promises'; // Requires Node.js fs module

async function loadExampleProject(filePath: string) {
  try {
    const fileData = await fs.readFile(filePath);
    const project: Project = await DawProject.loadProject(fileData);

    // Print project metadata
    console.log(`Project Version: ${project.version}`);
    console.log(`Application: ${project.application.name} v${project.application.version}`);
    console.log(`Tracks: ${project.structure.length}`);

  } catch (error) {
    console.error("Error loading project:", error);
  }
}

// Example usage:
// loadExampleProject("path/to/your/example.dawproject");
```

### **Creating an Empty DAWProject**

```typescript
import { DawProject, Project, Application, MetaData } from './src/dawproject';
import * as fs from 'fs/promises'; // Requires Node.js fs module

async function createEmptyProject(filePath: string) {
  try {
    // Initialize an empty project
    const project = new Project();
    project.application = new Application("My TypeScript App", "1.0.0");

    // Create minimal metadata
    const metadata = new MetaData();
    metadata.title = "Empty Project";

    // Save the project as a .dawproject container (ZIP)
    const embeddedFiles = {}; // No embedded files for an empty project
    const zipData = await DawProject.save(project, metadata, embeddedFiles);

    await fs.writeFile(filePath, zipData);
    console.log(`Empty project saved to ${filePath}`);

  } catch (error) {
    console.error("Error creating project:", error);
  }
}

// Example usage:
// createEmptyProject("new_project.dawproject");
```

### **Creating a Project with Audio Tracks**

```typescript
import {
  DawProject,
  Project,
  Application,
  MetaData,
  Track,
  Channel,
  RealParameter,
  Unit,
  ContentType,
  MixerRole,
  Utility,
  Referenceable // Needed for destination reference
} from './src/dawproject';
import * as fs from 'fs/promises'; // Requires Node.js fs module

async function createAudioProject(filePath: string) {
  try {
    // Reset ID counter for deterministic IDs in examples
    Referenceable.resetIdCounter();

    // Initialize a project
    const project = new Project();
    project.application = new Application("My Audio App", "1.0.0");

    // Create a master track
    const masterTrack = Utility.createTrack(
      "Master",
      new Set(), // Master track typically has no specific content type
      MixerRole.MASTER,
      1.0, // volume
      0.5  // pan (center)
    );
    project.structure.push(masterTrack);

    // Create an audio track
    const audioTrack = Utility.createTrack(
      "Lead Synth",
      new Set([ContentType.AUDIO]),
      MixerRole.REGULAR,
      0.8, // volume
      0.2  // pan (slightly left)
    );

    // Route the audio track's channel to the master track's channel
    if (audioTrack.channel && masterTrack.channel) {
        audioTrack.channel.destination = masterTrack.channel;
    } else {
        console.warn("Could not connect audio track channel to master track channel.");
    }

    // Add the track to the project structure
    project.structure.push(audioTrack);

    // Create minimal metadata
    const metadata = new MetaData();
    metadata.title = "Audio Project";

    // Save the project as a .dawproject container (ZIP)
    const embeddedFiles = {}; // No embedded files in this basic example
    const zipData = await DawProject.save(project, metadata, embeddedFiles);

    await fs.writeFile(filePath, zipData);
    console.log(`Audio project saved to ${filePath}`);

  } catch (error) {
    console.error("Error creating audio project:", error);
  }
}

// Example usage:
// createAudioProject("audio_project.dawproject");
```

## 🚀 Getting Started

To run the examples or integrate the library into your project:

1. Clone the repository:

    ```sh
    git clone https://github.com/perivar/dawproject-typescript.git
    cd dawproject-ts
    ```

2. Install dependencies:

    ```sh
    npm install
    # or
    yarn install
    ```

3. You can use `ts-node` to run TypeScript files directly or compile your TypeScript code to JavaScript.

## 🏗 Examples

An `src/dawproject_examples` folder is included in this repository, demonstrating how to use DAWProject-TS in real-world scenarios.

To execute an example script (e.g., `createExampleProject.ts`), navigate to the project directory in your terminal and run using `ts-node`:

```sh
npx ts-node src/dawproject_examples/createExampleProject.ts
```

This will typically create a `.dawproject` file in a designated output directory (check the example script for details).

## 📜 DAWProject Format

DAWProject is an **open XML-based format** designed to enable **cross-DAW compatibility**. Instead of exporting audio stems, `.dawproject` files allow projects to be shared across DAWs while preserving:

- 🎚 **Track names, volume, and panning**
- 🎛 **Effects and automation data**
- 🎵 **MIDI and audio region placements**
- 🕒 **Tempo and time signature changes**

For the full specification, visit [DAWProject on GitHub](https://github.com/bitwig/dawproject).

## 🛠 Development & Contributions

We **welcome contributions!** If you’d like to extend **DAWProject-TS**, whether by improving existing functionality or turning it into an **npm package**, feel free to contribute!

### **Clone the Repository**

```sh
git clone https://github.com/perivar/dawproject-typescript.git
cd dawproject-ts
```

### **Contributing**

- Fork the repository
- Create a feature branch (`git checkout -b feature-name`)
- Implement your changes and ensure tests pass (`npm test` or `yarn test`)
- Commit your changes (`git commit -m "Add feature XYZ"`)
- Push to GitHub (`git push origin feature-name`)
- Open a **Pull Request** 🚀

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🌎 Stay Connected

📢 Have ideas or feedback? Open an issue or start a discussion!
discussions) *(Note: Link may need to be created)*
⭐ **Star this repo** if you find it useful!

---

🎶 **DAWProject-Typescript – Enabling DAW interoperability!** 🚀
