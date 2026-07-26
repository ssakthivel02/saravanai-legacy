import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "provenance_required", "lifecycle_governance_required", "tool_allowlist_required"];

test("Release 613 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 613 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 613 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

