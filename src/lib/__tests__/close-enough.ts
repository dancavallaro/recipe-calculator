import { expect } from "vitest";
import { Quantity } from "../quantity";

expect.extend({
  toBeCloseEnough(received: Quantity, expected: Quantity, precision: number = 1) {
    const expectedDiff = Math.pow(10, -precision) / 2;
    const receivedDiff = Math.abs(expected.amount - received.as(expected.units));
    const pass = receivedDiff < expectedDiff;

    return {
      pass,
      message: () =>
        `expected ${received.str()} ${pass ? "not " : ""}to be close to ${expected.str()} (diff: ${receivedDiff.toFixed(precision + 2)}, threshold: ${expectedDiff})`,
    };
  },
});

declare module "vitest" {
  interface Assertion<T> {
    toBeCloseEnough(expected: Quantity, precision?: number): T;
  }
}
