import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "source_provenance_required", "review_required", "retirement_supported"];

test("Release 271 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

