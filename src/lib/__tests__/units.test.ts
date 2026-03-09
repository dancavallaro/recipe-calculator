import { describe, it, expect } from "vitest";
import { convert, unitCategory } from "../units";

describe("convert", () => {
  it("converts between mass units", () => {
    expect(convert(1, "lb", "g")).toBeCloseTo(453.59237, 2);
    expect(convert(1, "kg", "lb")).toBeCloseTo(2.20462, 3);
    expect(convert(16, "oz", "lb")).toBeCloseTo(1, 5);
  });

  it("converts between volume units", () => {
    expect(convert(1, "gal", "cup")).toBeCloseTo(16, 1);
    expect(convert(1, "gal", "l")).toBeCloseTo(3.78541, 3);
    expect(convert(1, "Tbs", "tsp")).toBeCloseTo(3, 1);
    expect(convert(1, "cup", "ml")).toBeCloseTo(236.588, 1);
  });

  it("converts between length units", () => {
    expect(convert(1, "in", "cm")).toBeCloseTo(2.54, 5);
    expect(convert(2.54, "cm", "in")).toBeCloseTo(1, 5);
  });

  it("throws on cross-category conversion", () => {
    expect(() => convert(1, "g", "ml")).toThrow();
    expect(() => convert(1, "in", "g")).toThrow();
  });
});

describe("unitCategory", () => {
  it("returns correct categories", () => {
    expect(unitCategory("g")).toBe("mass");
    expect(unitCategory("cup")).toBe("volume");
    expect(unitCategory("in")).toBe("length");
  });
});
