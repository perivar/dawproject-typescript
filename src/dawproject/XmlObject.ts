import { XMLBuilder, XMLParser } from "fast-xml-parser";

import { XML_BUILDER_OPTIONS, XML_PARSER_OPTIONS } from "./xml/options";

// Abstract base class for serialization/deserialization
export abstract class XmlObject {
  abstract toXmlObject(): any;
  abstract fromXmlObject(obj: any): this;

  // Helper method to convert an object to XML using fast-xml-parser
  toXml(): string {
    const builder = new XMLBuilder(XML_BUILDER_OPTIONS);

    const obj = this.toXmlObject();
    return builder.build(obj);
  }

  // Helper method to convert XML to object using fast-xml-parser
  static fromXml<T extends XmlObject>(xml: string, ctor: { new (): T }): T {
    const parser = new XMLParser(XML_PARSER_OPTIONS);

    const parsedObj = parser.parse(xml);
    const rootName = ctor.name;

    if (!parsedObj[rootName]) {
      throw new Error(
        `Missing or incorrect root element in XML for ${rootName}`
      );
    }

    return new ctor().fromXmlObject(parsedObj[rootName]);
  }
}
