import { Lane } from "../lane";
import { BaseConstructor, BaseFactory, BaseRegistry } from "./baseRegistry";

export interface LaneConstructor extends BaseConstructor<Lane> {}

export interface LaneFactory extends BaseFactory<Lane> {}

export class LaneRegistry extends BaseRegistry<Lane> {
  private static instance: LaneRegistry;

  private constructor() {
    super("lane");
  }

  static getInstance(): LaneRegistry {
    if (!LaneRegistry.instance) {
      LaneRegistry.instance = new LaneRegistry();
    }
    return LaneRegistry.instance;
  }

  static register(
    tagName: string,
    laneClass: LaneConstructor,
    factory: LaneFactory
  ): void {
    LaneRegistry.getInstance().register(tagName, laneClass, factory);
  }

  static getLaneClass(tagName: string): LaneConstructor | undefined {
    return LaneRegistry.getInstance().getConstructor(tagName);
  }

  static createLaneFromXml(tagName: string, xmlObject: any): Lane | undefined {
    const factory = LaneRegistry.getInstance().getFactory(tagName);
    if (factory) {
      return factory(xmlObject);
    }
    return undefined;
  }
}

export function registerLane(tagName: string, factory: LaneFactory) {
  return function (target: LaneConstructor) {
    LaneRegistry.register(tagName, target, factory);
  };
}
