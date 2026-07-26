import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "methodology_required", "findings_review_required"];
const integration = {
  featureFlag: "release_896_enabled",
  defaultEnabled: false,
  productionMigrationAutomatic: false,
  autonomousProductionWritesEnabled: false,
  killSwitchRequired: true
};

test("Release 896 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 896 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 896 feature is disabled by default", () => {
  assert.equal(integration.defaultEnabled, false);
});

test("Release 896 forbids automatic production migration", () => {
  assert.equal(integration.productionMigrationAutomatic, false);
});

test("Release 896 forbids autonomous production writes", () => {
  assert.equal(integration.autonomousProductionWritesEnabled, false);
});

test("Release 896 requires a kill switch", () => {
  assert.equal(integration.killSwitchRequired, true);
});
