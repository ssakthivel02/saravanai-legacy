import test from "node:test";
import assert from "node:assert/strict";

const controls = ["document_provenance_required", "classification_required", "confidence_bounded", "low_confidence_review"];

test("Release 265 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

