import { IMetaData } from "./types";
import { XmlObject } from "./XmlObject";

/** Metadata root element of the DAWPROJECT format. This is stored in the file metadata.xml file inside the container. */
export class MetaData extends XmlObject implements IMetaData {
  /** Title of the song/project. */
  title?: string;
  /** Recording Artist. */
  artist?: string;
  /** Album. */
  album?: string;
  /** Original Artist. */
  originalArtist?: string;
  /** Composer. */
  composer?: string;
  /** Songwriter. */
  songwriter?: string;
  /** Producer. */
  producer?: string;
  /** Arranger. */
  arranger?: string;
  /** Year this project/song was recorded. */
  year?: string;
  /** Genre/style */
  genre?: string;
  /** Copyright notice. */
  copyright?: string;
  /** URL to website related to this project. */
  website?: string;
  /** General comment or description. */
  comment?: string;

  constructor(
    title?: string,
    artist?: string,
    album?: string,
    originalArtist?: string,
    composer?: string,
    songwriter?: string,
    producer?: string,
    arranger?: string,
    year?: string,
    genre?: string,
    copyright?: string,
    website?: string,
    comment?: string
  ) {
    super();
    this.title = title;
    this.artist = artist;
    this.album = album;
    this.originalArtist = originalArtist;
    this.composer = composer;
    this.songwriter = songwriter;
    this.producer = producer;
    this.arranger = arranger;
    this.year = year;
    this.genre = genre;
    this.copyright = copyright;
    this.website = website;
    this.comment = comment;
  }

  toXmlObject(): any {
    const obj: any = { MetaData: {} };
    if (this.title !== undefined) obj.MetaData.Title = this.title;
    if (this.artist !== undefined) obj.MetaData.Artist = this.artist;
    if (this.album !== undefined) obj.MetaData.Album = this.album;
    if (this.originalArtist !== undefined)
      obj.MetaData.OriginalArtist = this.originalArtist;
    if (this.composer !== undefined) obj.MetaData.Composer = this.composer;
    if (this.songwriter !== undefined)
      obj.MetaData.Songwriter = this.songwriter;
    if (this.producer !== undefined) obj.MetaData.Producer = this.producer;
    if (this.arranger !== undefined) obj.MetaData.Arranger = this.arranger;
    if (this.year !== undefined) obj.MetaData.Year = this.year;
    if (this.genre !== undefined) obj.MetaData.Genre = this.genre;
    if (this.copyright !== undefined) obj.MetaData.Copyright = this.copyright;
    if (this.website !== undefined) obj.MetaData.Website = this.website;
    if (this.comment !== undefined) obj.MetaData.Comment = this.comment;
    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    this.title = xmlObject.Title;
    this.artist = xmlObject.Artist;
    this.album = xmlObject.Album;
    this.originalArtist = xmlObject.OriginalArtist;
    this.composer = xmlObject.Composer;
    this.songwriter = xmlObject.Songwriter;
    this.producer = xmlObject.Producer;
    this.arranger = xmlObject.Arranger;
    this.year = xmlObject.Year;
    this.genre = xmlObject.Genre;
    this.copyright = xmlObject.Copyright;
    this.website = xmlObject.Website;
    this.comment = xmlObject.Comment;
    return this;
  }
}
