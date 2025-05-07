import { Point } from "../timeline/point";
import { BaseConstructor, BaseFactory, BaseRegistry } from "./baseRegistry";

export interface PointConstructor extends BaseConstructor<Point> {}

export interface PointFactory extends BaseFactory<Point> {}

export class PointRegistry extends BaseRegistry<Point> {
  private static instance: PointRegistry;

  private constructor() {
    super("point");
  }

  static getInstance(): PointRegistry {
    if (!PointRegistry.instance) {
      PointRegistry.instance = new PointRegistry();
    }
    return PointRegistry.instance;
  }

  static register(
    tagName: string,
    pointClass: PointConstructor,
    factory: PointFactory
  ): void {
    PointRegistry.getInstance().register(tagName, pointClass, factory);
  }

  static getPointClass(tagName: string): PointConstructor | undefined {
    return PointRegistry.getInstance().getConstructor(tagName);
  }

  static createPointFromXml(
    tagName: string,
    xmlObject: any
  ): Point | undefined {
    const factory = PointRegistry.getInstance().getFactory(tagName);
    if (factory) {
      return factory(xmlObject);
    }
    return undefined;
  }
}

export function registerPoint(tagName: string, factory: PointFactory) {
  return function (target: PointConstructor) {
    PointRegistry.register(tagName, target, factory);
  };
}
