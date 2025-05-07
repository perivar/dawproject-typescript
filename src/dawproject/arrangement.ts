import { Referenceable } from "./referenceable";
import { Lanes } from "./timeline/lanes";
import { Markers } from "./timeline/markers";
import { Points } from "./timeline/points";
import { IArrangement } from "./types";

/** Represents the main Arrangement timeline of a DAW. */
export class Arrangement extends Referenceable implements IArrangement {
  /** Automation data for time-signature inside this Arrangement.
   * <pre>{@code
   * <Arrangement>
   *   <TimeSignatureAutomation target="id-of-TimeSignatureParameter" ... >
   *     <TimeSignaturePoint time="0" numerator="7", denominator="8"/>
   *     <TimeSignaturePoint time="21" numerator="4", denominator="4"/>
   *        ...
   *   </TimeSignatureAutomation>
   * </Arrangement>
   * }</pre>
   *  */
  timeSignatureAutomation?: Points;
  /** Automation data for tempo inside this Arrangement, which will define the conversion between seconds and beats
   * at the root level. */
  tempoAutomation?: Points;
  /** Cue markers inside this arrangement */
  markers?: Markers;
  /** The lanes of this arrangement. Generally this would contain another Lanes timeline for (and scoped to) each
   * track which would then contain all Note, Audio, and Automation timelines. */
  lanes?: Lanes;

  constructor(
    timeSignatureAutomation?: Points,
    tempoAutomation?: Points,
    markers?: Markers,
    lanes?: Lanes,
    name?: string,
    color?: string,
    comment?: string
  ) {
    super(name, color, comment);
    this.timeSignatureAutomation = timeSignatureAutomation;
    this.tempoAutomation = tempoAutomation;
    this.markers = markers;
    this.lanes = lanes;
  }

  toXmlObject(): any {
    const obj: any = {
      Arrangement: {
        ...super.toXmlObject(), // get attributes from Referenceable
      },
    };

    if (this.timeSignatureAutomation) {
      obj.Arrangement.TimeSignatureAutomation =
        this.timeSignatureAutomation.toXmlObject().Points; // Get the inner object
    }
    if (this.tempoAutomation) {
      obj.Arrangement.TempoAutomation =
        this.tempoAutomation.toXmlObject().Points; // Get the inner object
    }
    if (this.lanes) {
      obj.Arrangement.Lanes = this.lanes.toXmlObject().Lanes; // Get the inner object
    }
    if (this.markers) {
      obj.Arrangement.Markers = this.markers.toXmlObject().Markers; // Get the inner object
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    super.fromXmlObject(xmlObject); // populate inherited attributes from Referenceable

    if (xmlObject.TimeSignatureAutomation) {
      this.timeSignatureAutomation = new Points().fromXmlObject(
        xmlObject.TimeSignatureAutomation
      );
    }
    if (xmlObject.TempoAutomation) {
      this.tempoAutomation = new Points().fromXmlObject(
        xmlObject.TempoAutomation
      );
    }
    if (xmlObject.Markers) {
      this.markers = new Markers().fromXmlObject(xmlObject.Markers);
    }
    if (xmlObject.Lanes) {
      this.lanes = new Lanes().fromXmlObject(xmlObject.Lanes);
    }

    return this;
  }
}
