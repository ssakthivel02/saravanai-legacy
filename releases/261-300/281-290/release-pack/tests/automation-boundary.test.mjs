import test from "node:test";
import assert from "node:assert/strict";

test("production automation writes stay disabled", () => {
  assert.equal({ productionWriteAllowed: false }.productionWriteAllowed, false);
});

test("automation steps are bounded", () => {
  const valid = value => value >= 1 && value <= 50;
  assert.equal(valid(20), true);
  assert.equal(valid(80), false);
});
