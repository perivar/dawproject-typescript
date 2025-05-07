import { X2jOptions, XmlBuilderOptions } from "fast-xml-parser";

export const XML_BUILDER_OPTIONS: XmlBuilderOptions = {
  attributeNamePrefix: "@_",
  ignoreAttributes: false,
  suppressBooleanAttributes: false,
  format: true,
  indentBy: "    ",
  suppressEmptyNode: true,
};

export const XML_PARSER_OPTIONS: X2jOptions = {
  attributeNamePrefix: "@_",
  ignoreAttributes: false,
  allowBooleanAttributes: true,
};
