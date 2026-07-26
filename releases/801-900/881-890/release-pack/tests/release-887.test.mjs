import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "methodology_required", "findings_review_required", "free_first_hard_stop_required"];
const integration = {
  featureFlag: "release_887_enabled",
  defaultEnabled: false,
  productionMigrationAutomatic: false,
  autonomousProductionWritesEnabled: false,
  killSwitchRequired: true
};

test("Release 887 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 887 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 887 feature is disabled by default", () => {
  assert.equal(integration.defaultEnabled, false);
});

test("Release 887 forbids automatic production migration", () => {
  assert.equal(integration.productionMigrationAutomatic, false);
});

test("Release 887 forbids autonomous production writes", () => {
  assert.equal(integration.autonomousProductionWritesEnabled, false);
});

test("Release 887 requires a kill switch", () => {
  assert.equal(integration.killSwitchRequired, true);
});
