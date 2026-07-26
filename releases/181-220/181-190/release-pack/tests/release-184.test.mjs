import test from "node:test";
import assert from "node:assert/strict";

const controls = ["source_provenance_required", "access_policy_required", "freshness_recorded", "retirement_supported"];

test("Release 184 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

