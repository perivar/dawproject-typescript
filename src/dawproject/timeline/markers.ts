import { registerTimeline } from "../registry/timelineRegistry";
import type { IMarkers, ITrack } from "../types";
import { Marker } from "./marker";
import { Timeline } from "./timeline";
import { TimeUnit } from "./timeUnit";

const markersFactory = (xmlObject: any): Markers => {
  const instance = new Markers();
  instance.fromXmlObject(xmlObject);
  return instance;
};

@registerTimeline("Markers", markersFactory)
export class Markers extends Timeline implements IMarkers {
  markers: Marker[];

  constructor(
    markers?: Marker[],
    track?: ITrack,
    timeUnit?: TimeUnit,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(track, timeUnit, name, color, comment);
    this.markers = markers || [];
  }

  toXmlObject(): any {
    const obj: any = {
      Markers: {
        ...super.toXmlObject(), // get attributes from Timeline
      },
    };

    // Append child elements for each marker
    if (this.markers && this.markers.length > 0) {
      obj.Markers.Marker = this.markers.map(marker => marker.toXmlObject());
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Timeline

    // Process child elements of type Marker
    const markers: Marker[] = [];
    if (xmlObject.Marker) {
      const markerArray = Array.isArray(xmlObject.Marker)
        ? xmlObject.Marker
        : [xmlObject.Marker];
      markerArray.forEach((markerObj: any) => {
        markers.push(new Marker().fromXmlObject(markerObj));
      });
    }
    this.markers = markers;

    return this;
  }
}
