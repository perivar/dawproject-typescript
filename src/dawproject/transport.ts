import { RealParameter } from "./realParameter";
import { TimeSignatureParameter } from "./timeSignatureParameter";
import { ITransport } from "./types";
import { XmlObject } from "./XmlObject";

/** Transport element containing playback parameters such as Tempo and Time-signature. */
export class Transport extends XmlObject implements ITransport {
  /** Tempo parameter for setting and/or automating the tempo. */
  tempo?: RealParameter;
  /** Time-signature parameter. */
  timeSignature?: TimeSignatureParameter;

  constructor(tempo?: RealParameter, timeSignature?: TimeSignatureParameter) {
    super();
    this.tempo = tempo;
    this.timeSignature = timeSignature;
  }

  toXmlObject(): any {
    const obj: any = {
      Transport: {},
    };

    if (this.tempo) {
      obj.Transport.Tempo = this.tempo.toXmlObject().RealParameter;
    }

    if (this.timeSignature) {
      obj.Transport.TimeSignature =
        this.timeSignature.toXmlObject().TimeSignatureParameter;
    }

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    if (xmlObject.Tempo) {
      this.tempo = new RealParameter().fromXmlObject(xmlObject.Tempo);
    }

    if (xmlObject.TimeSignature) {
      this.timeSignature = new TimeSignatureParameter().fromXmlObject(
        xmlObject.TimeSignature
      );
    }

    return this;
  }
}
