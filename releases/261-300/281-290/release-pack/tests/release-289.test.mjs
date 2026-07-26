import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "target_required", "evidence_required", "freshness_required"];

test("Release 289 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

