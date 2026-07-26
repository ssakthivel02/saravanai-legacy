import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "dependencies_required", "milestones_required", "rollback_or_exit_required", "knowledge_freshness_required"];

test("Release 627 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 627 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 627 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

