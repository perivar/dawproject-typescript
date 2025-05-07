import { DoubleAdapter } from "../doubleAdapter";

describe("DoubleAdapter", () => {
  test("should correctly marshal and unmarshal infinity values", () => {
    expect(DoubleAdapter.fromXml("inf")).toBe(Infinity);
    expect(DoubleAdapter.fromXml("-inf")).toBe(-Infinity);
    expect(DoubleAdapter.toXml(Infinity)).toBe("inf");
    expect(DoubleAdapter.toXml(-Infinity)).toBe("-inf");
  });

  // Add more tests for other cases if needed, based on DoubleAdapter implementation
});
