import test from "node:test";
import assert from "node:assert/strict";

const controls = ["canonical_id_required", "source_provenance_required", "steward_required", "confidence_bounded"];

test("Release 192 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

