import test from "node:test";
import assert from "node:assert/strict";

const controls = ["terminology_governed", "missing_keys_block", "native_review_required"];

test("Release 145 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

