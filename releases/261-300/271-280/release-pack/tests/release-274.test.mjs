import test from "node:test";
import assert from "node:assert/strict";

const controls = ["locale_pair_required", "terminology_required", "confidence_bounded", "native_review_required"];

test("Release 274 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

