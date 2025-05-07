import { Timeline } from "../timeline/timeline";
import { BaseConstructor, BaseFactory, BaseRegistry } from "./baseRegistry";

export interface TimelineConstructor extends BaseConstructor<Timeline> {}

export interface TimelineFactory extends BaseFactory<Timeline> {}

export class TimelineRegistry extends BaseRegistry<Timeline> {
  private static instance: TimelineRegistry;

  private constructor() {
    super("timeline");
  }

  static getInstance(): TimelineRegistry {
    if (!TimelineRegistry.instance) {
      TimelineRegistry.instance = new TimelineRegistry();
    }
    return TimelineRegistry.instance;
  }

  static register(
    tagName: string,
    timelineClass: TimelineConstructor,
    factory: TimelineFactory
  ): void {
    TimelineRegistry.getInstance().register(tagName, timelineClass, factory);
  }

  static getTimelineClass(tagName: string): TimelineConstructor | undefined {
    return TimelineRegistry.getInstance().getConstructor(tagName);
  }

  static createTimelineFromXml(
    tagName: string,
    xmlObject: any
  ): Timeline | undefined {
    const factory = TimelineRegistry.getInstance().getFactory(tagName);
    if (factory) {
      return factory(xmlObject);
    }
    return undefined;
  }
}

export function registerTimeline(tagName: string, factory: TimelineFactory) {
  return function (target: TimelineConstructor) {
    TimelineRegistry.register(tagName, target, factory);
  };
}
