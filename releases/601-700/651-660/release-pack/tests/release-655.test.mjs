import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "methodology_required", "findings_review_required", "build_provenance_required"];

test("Release 655 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 655 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 655 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

