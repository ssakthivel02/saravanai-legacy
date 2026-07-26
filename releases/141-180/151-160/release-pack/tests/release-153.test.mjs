import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "due_date_required", "evidence_required"];

test("Release 153 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

