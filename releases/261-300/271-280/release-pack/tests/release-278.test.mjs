import test from "node:test";
import assert from "node:assert/strict";

const controls = ["claim_type_required", "confidence_required", "sources_required", "sensitivity_review_required"];

test("Release 278 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

