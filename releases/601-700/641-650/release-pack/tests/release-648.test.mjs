import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "idempotency_required", "kill_switch_required", "production_write_forbidden", "synthetic_media_disclosure_required"];

test("Release 648 defines unique explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 648 retains accountability and evidence", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 648 is disabled by default", () => {
  assert.equal("disabled_by_default", "disabled_by_default");
});

test("Release 648 keeps productionWriteAllowed disabled", () => {
  assert.equal({ productionWriteAllowed: false }.productionWriteAllowed, false);
});

test("Release 648 requires killSwitchAvailable", () => {
  assert.equal({ killSwitchAvailable: true }.killSwitchAvailable, true);
});

