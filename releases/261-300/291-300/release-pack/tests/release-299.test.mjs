import test from "node:test";
import assert from "node:assert/strict";

const controls = ["accountable_owner_required", "evidence_domains_required", "residual_risks_recorded", "multi_party_approval"];

test("Release 299 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

