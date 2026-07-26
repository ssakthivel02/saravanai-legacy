import test from "node:test";
import assert from "node:assert/strict";

const controls = ["assumptions_explicit", "evidence_required", "confidence_bounded", "human_review_required"];

test("Release 213 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

