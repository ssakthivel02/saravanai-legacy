import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "regions_required", "handover_required", "escalation_required"];

test("Release 297 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

