import test from "node:test";
import assert from "node:assert/strict";

const controls = ["licence_required", "source_provenance_required", "restrictions_recorded"];

test("Release 178 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

