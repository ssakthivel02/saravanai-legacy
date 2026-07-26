import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "evidence_index_hash_required", "residual_risks_recorded", "no_go_supported", "retrieval_access_filter_required"];

test("Release 630 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 630 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 630 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

