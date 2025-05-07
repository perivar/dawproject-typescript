import { Channel } from "./channel";
import { ContentType } from "./contentType";
import { Lane } from "./lane";
import { registerLane } from "./registry/laneRegistry";
import { ITrack } from "./types";
import { Utility } from "./utility";

const trackFactory = (xmlObject: any): Track => {
  const instance = new Track();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerLane("Track", trackFactory)
/** Represents a sequencer track.  */
export class Track extends Lane implements ITrack {
  /** Role of this track in timelines & arranger. Can be multiple (comma-separated). */
  contentType: ContentType[];
  /** If this track is loaded/active of not. */
  loaded?: boolean;
  /** Mixer channel used for the output of this track. */
  channel?: Channel;
  /** Child tracks, typically used to represent group/folder tracks with contentType="tracks". */
  tracks: Track[]; // Nested tracks

  constructor(
    contentType: ContentType[] = [],
    loaded?: boolean,
    channel?: Channel,
    tracks?: Track[],
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.contentType = contentType;
    this.loaded = loaded;
    this.channel = channel;
    this.tracks = tracks || [];
  }

  toXmlObject(): any {
    const obj: any = {
      Track: {
        ...super.toXmlObject(), // get attributes from Lane
      },
    };

    // add optional attributes
    // contentType is a list of strings, so we join them with commas
    Utility.addAttribute(obj.Track, "contentType", this, {
      adapter: (value: ContentType[]) => value.join(","),
    });
    Utility.addAttribute(obj.Track, "loaded", this);

    // append Channel as a nested XML element if present
    if (this.channel) {
      obj.Track.Channel = this.channel.toXmlObject().Channel;
    }

    // recursively add nested tracks
    if (this.tracks && this.tracks.length > 0) {
      obj.Track.Track = this.tracks.map(track => track.toXmlObject().Track);
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Lane

    // extract contentType text and split into a list
    Utility.populateAttribute<ContentType[]>(xmlObject, "contentType", this, {
      adapter: (value: string) => value.split(",") as ContentType[],
    });

    // parse the loaded attribute, converting 'true'/'false' to Boolean
    Utility.populateAttribute<boolean>(xmlObject, "loaded", this, {
      castTo: Boolean,
    });

    // initialize channel using Channel's fromXmlObject method if present
    if (xmlObject.Channel) {
      this.channel = new Channel().fromXmlObject(xmlObject.Channel);
    }

    // recursively parse nested Track elements
    const tracks: Track[] = [];
    if (xmlObject.Track) {
      const trackArray = Array.isArray(xmlObject.Track)
        ? xmlObject.Track
        : [xmlObject.Track];
      trackArray.forEach((trackObj: any) => {
        tracks.push(new Track().fromXmlObject(trackObj));
      });
    }
    this.tracks = tracks;

    return this;
  }
}
