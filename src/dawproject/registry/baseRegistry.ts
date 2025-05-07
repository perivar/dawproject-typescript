export interface BaseConstructor<T> {
  new (...args: any[]): T;
}

export interface BaseFactory<T> {
  (xmlObject: any): T;
}

export abstract class BaseRegistry<T> {
  private static registries: {
    [key: string]: {
      [key: string]: {
        constructor: BaseConstructor<any>;
        factory: BaseFactory<any>;
      };
    };
  } = {};

  constructor(protected readonly registryName: string) {}

  register(
    tagName: string,
    classType: BaseConstructor<T>,
    factory: BaseFactory<T>
  ): void {
    if (!BaseRegistry.registries[this.registryName]) {
      BaseRegistry.registries[this.registryName] = {};
    }
    BaseRegistry.registries[this.registryName][tagName] = {
      constructor: classType,
      factory,
    };
  }

  getConstructor(tagName: string): BaseConstructor<T> | undefined {
    if (!BaseRegistry.registries[this.registryName]) {
      return undefined;
    }
    return BaseRegistry.registries[this.registryName][tagName]?.constructor;
  }

  getFactory(tagName: string): BaseFactory<T> | undefined {
    if (!BaseRegistry.registries[this.registryName]) {
      return undefined;
    }
    return BaseRegistry.registries[this.registryName][tagName]?.factory;
  }

  protected getRegistry(): {
    [key: string]: { constructor: BaseConstructor<T>; factory: BaseFactory<T> };
  } {
    if (!BaseRegistry.registries[this.registryName]) {
      BaseRegistry.registries[this.registryName] = {};
    }
    return BaseRegistry.registries[this.registryName];
  }
}
