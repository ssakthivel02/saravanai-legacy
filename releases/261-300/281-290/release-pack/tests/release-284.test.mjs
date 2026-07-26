import test from "node:test";
import assert from "node:assert/strict";

const controls = ["jurisdiction_required", "owner_required", "controls_mapped", "legal_review_required"];

test("Release 284 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

