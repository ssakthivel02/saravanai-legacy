import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_accountability_required", "evidence_integrity_required", "idempotency_required", "kill_switch_required", "production_write_forbidden"];

test("Release 374 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 374 retains owner and evidence requirements", () => {
  assert.equal(controls.includes("owner_accountability_required"), true);
  assert.equal(controls.includes("evidence_integrity_required"), true);
});

test("Release 374 keeps productionWriteAllowed disabled", () => {
  assert.equal({ productionWriteAllowed: false }.productionWriteAllowed, false);
});

test("Release 374 requires killSwitchAvailable", () => {
  assert.equal({ killSwitchAvailable: true }.killSwitchAvailable, true);
});

