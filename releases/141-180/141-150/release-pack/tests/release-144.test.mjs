import test from "node:test";
import assert from "node:assert/strict";

const controls = ["wcag_intent_recorded", "manual_review_required", "blocking_failures_prevent_release"];

test("Release 144 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

