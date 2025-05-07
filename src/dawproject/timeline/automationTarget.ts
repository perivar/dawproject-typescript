import { ExpressionType } from "../expressionType";
import { Parameter } from "../parameter";
import { Referenceable } from "../referenceable"; // Import Referenceable
import type { IAutomationTarget } from "../types";
import { Utility } from "../utility";
import { XmlObject } from "../XmlObject";

export class AutomationTarget extends XmlObject implements IAutomationTarget {
  parameter?: Parameter;
  expression?: ExpressionType;
  channel?: number;
  key?: number;
  controller?: number;

  constructor(
    parameter?: Parameter,
    expression?: ExpressionType,
    channel?: number,
    key?: number,
    controller?: number
  ) {
    super();
    this.parameter = parameter;
    this.expression = expression;
    this.channel = channel;
    this.key = key;
    this.controller = controller;
  }

  toXmlObject(): any {
    const obj: any = {
      Target: {},
    };

    // add optional attributes
    Utility.addAttribute(obj.Target, "parameter", this);
    Utility.addAttribute(obj.Target, "expression", this);
    Utility.addAttribute(obj.Target, "channel", this);
    Utility.addAttribute(obj.Target, "key", this);
    Utility.addAttribute(obj.Target, "controller", this);

    return obj;
  }

  fromXmlObject(xmlObject: any): this {
    // parse parameter attribute and get the referenced Parameter object
    if (xmlObject["@_parameter"] !== undefined) {
      const parameterId = xmlObject["@_parameter"];
      const referencedParameter = Referenceable.getById(parameterId);
      if (referencedParameter instanceof Parameter) {
        this.parameter = referencedParameter;
      } else {
        console.warn(
          `Could not find referenced Parameter with id: ${parameterId}`
        );
        this.parameter = undefined; // Or handle error appropriately
      }
    }

    // validate and populate optional attributes
    Utility.populateAttribute<ExpressionType>(xmlObject, "expression", this, {
      castTo: ExpressionType,
    });
    Utility.populateAttribute<number>(xmlObject, "channel", this, {
      castTo: Number,
    });
    Utility.populateAttribute<number>(xmlObject, "key", this, {
      castTo: Number,
    });
    Utility.populateAttribute<number>(xmlObject, "controller", this, {
      castTo: Number,
    });

    return this;
  }
}
