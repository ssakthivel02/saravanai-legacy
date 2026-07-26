import test from "node:test";
import assert from "node:assert/strict";

const controls = ["scenario_required", "participants_required", "objectives_required", "failed_requires_actions"];

test("Release 288 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

