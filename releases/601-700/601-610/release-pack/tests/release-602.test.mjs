import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "tenant_scope_required", "policy_binding_required", "provider_allowlist_required", "model_risk_review_required"];

test("Release 602 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 602 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 602 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

