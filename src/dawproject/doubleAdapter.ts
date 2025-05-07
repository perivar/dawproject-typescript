export class DoubleAdapter {
  static toXml(value: number | null | undefined): string | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (value === Infinity) {
      return "inf";
    } else if (value === -Infinity) {
      return "-inf";
    } else {
      return parseFloat(value.toFixed(6)).toString();
    }
  }

  static fromXml(value: string | null | undefined): number | undefined {
    if (
      value === null ||
      value === undefined ||
      value === "null" ||
      value === ""
    ) {
      return undefined;
    }
    if (value === "inf") {
      return Infinity;
    } else if (value === "-inf") {
      return -Infinity;
    } else {
      return parseFloat(value);
    }
  }
}
