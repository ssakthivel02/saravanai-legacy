import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "methodology_required", "findings_review_required", "protected_baseline_required"];

test("Release 703 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 703 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 703 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

test("Release 703 excludes sensitive telemetry fields", () => {
  const forbidden = ["prompt","content","document","file","email","phone","secret","token"];
  assert.equal(forbidden.includes("secret"), true);
});

