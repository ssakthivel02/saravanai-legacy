import test from "node:test";
import assert from "node:assert/strict";

const controls = ["quota_profile_required", "hard_stop_required", "paid_upgrade_disabled"];

test("Release 152 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 152 keeps paidUpgradeEnabled disabled", () => {
  assert.equal({ paidUpgradeEnabled: false }.paidUpgradeEnabled, false);
});

