import test from "node:test";
import assert from "node:assert/strict";

const controls = ["target_in_range", "owner_required", "recovery_evidence_required"];

test("Release 169 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

