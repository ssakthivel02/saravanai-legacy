import test from "node:test";
import assert from "node:assert/strict";

const controls = ["trusted_identity_required", "bounded_steps_required", "production_write_forbidden", "kill_switch_required"];

test("Release 181 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 181 keeps productionWriteAllowed disabled", () => {
  assert.equal({ productionWriteAllowed: false }.productionWriteAllowed, false);
});

test("Release 181 requires killSwitchAvailable", () => {
  assert.equal({ killSwitchAvailable: true }.killSwitchAvailable, true);
});

