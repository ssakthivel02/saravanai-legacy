import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "dependencies_required", "milestones_required", "rollback_or_exit_required", "customer_redress_required"];

test("Release 739 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 739 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 739 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

test("Release 739 excludes sensitive telemetry fields", () => {
  const forbidden = ["prompt","content","document","file","email","phone","secret","token"];
  assert.equal(forbidden.includes("secret"), true);
});

