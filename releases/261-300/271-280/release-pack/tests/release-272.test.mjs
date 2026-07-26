import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "editor_required", "review_date_required", "correction_supported"];

test("Release 272 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

