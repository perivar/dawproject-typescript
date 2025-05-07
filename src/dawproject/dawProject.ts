import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";

import { MetaData } from "./metaData";
import { Project } from "./project";
import { XML_PARSER_OPTIONS } from "./xml/options";
import { XmlObject } from "./XmlObject"; // Import XmlObject

/**
 * The main class for handling DAWproject files.
 */
export class DawProject {
  /** The format name. */
  static FORMAT_NAME = "DAWproject exchange format";
  /** The file extension. */
  static FILE_EXTENSION = "dawproject";
  /** The name of the project file within the container. */
  static PROJECT_FILE = "project.xml";
  /** The name of the metadata file within the container. */
  static METADATA_FILE = "metadata.xml";

  /**
  /**
   * Remove BOM from the start of text
   */
  static stripBom(data: Uint8Array): string {
    const decoder = new TextDecoder("utf-8");
    let text = decoder.decode(data);

    // Remove BOM if present
    if (text.charCodeAt(0) === 0xfeff) {
      text = text.slice(1);
    }

    return text;
  }

  /**
   * Save project to a Uint8Array containing the ZIP file
   */
  static async save(
    project: Project,
    metadata: MetaData,
    embeddedFiles: { [path: string]: Uint8Array }
  ): Promise<Uint8Array> {
    const zip = new JSZip();

    // Add metadata and project XML files
    const metadataXml = metadata.toXml(); // Use XmlObject.toXml()
    const projectXml = project.toXml(); // Use XmlObject.toXml()

    zip.file(DawProject.METADATA_FILE, new TextEncoder().encode(metadataXml));
    zip.file(DawProject.PROJECT_FILE, new TextEncoder().encode(projectXml));

    // Add embedded files
    for (const [path, data] of Object.entries(embeddedFiles)) {
      zip.file(path, data);
    }

    // Generate ZIP file as Uint8Array
    return await zip.generateAsync({ type: "uint8array" });
  }

  /**
   * Load project from a Uint8Array containing the ZIP file
   */
  static async loadProject(data: Uint8Array): Promise<Project> {
    const zip = await JSZip.loadAsync(data);
    const projectEntry = await zip
      .file(DawProject.PROJECT_FILE)
      ?.async("uint8array");

    if (!projectEntry) {
      throw new Error("Project file not found in archive");
    }

    const xmlString = DawProject.stripBom(projectEntry);
    return XmlObject.fromXml(xmlString, Project);
  }

  /**
   * Load metadata from a Uint8Array containing the ZIP file
   */
  static async loadMetadata(data: Uint8Array): Promise<MetaData> {
    const zip = await JSZip.loadAsync(data);
    const metadataEntry = await zip
      .file(DawProject.METADATA_FILE)
      ?.async("uint8array");

    if (!metadataEntry) {
      throw new Error("Metadata file not found in archive");
    }

    const xmlString = DawProject.stripBom(metadataEntry);
    return XmlObject.fromXml(xmlString, MetaData);
  }

  /**
   * Get embedded file contents from a Uint8Array containing the ZIP file
   */
  static async getEmbedded(
    data: Uint8Array,
    embeddedPath: string
  ): Promise<Uint8Array> {
    const zip = await JSZip.loadAsync(data);
    const entry = await zip.file(embeddedPath)?.async("uint8array");

    if (!entry) {
      throw new Error(`Embedded file ${embeddedPath} not found in archive`);
    }

    return entry;
  }

  /**
   * Validate project XML
   * This is a simplified validation that just checks if the XML is well-formed
   */
  static async validate(project: Project): Promise<void> {
    try {
      const projectXml = project.toXml(); // Use XmlObject.toXml()
      const parser = new XMLParser(XML_PARSER_OPTIONS);
      try {
        parser.parse(projectXml);
        // If we get here, the XML is well-formed
        return Promise.resolve();
      } catch (e) {
        throw new Error("XML validation failed: XML is not well-formed");
      }
    } catch (e) {
      throw new Error(`Validation failed: ${(e as any).message || e}`);
    }
  }
}
