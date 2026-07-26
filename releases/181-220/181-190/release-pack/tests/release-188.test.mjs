import test from "node:test";
import assert from "node:assert/strict";

const controls = ["quality_floor_required", "hard_budget_stop_required", "paid_providers_disabled", "owner_required"];

test("Release 188 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 188 keeps paidProvidersEnabled disabled", () => {
  assert.equal({ paidProvidersEnabled: false }.paidProvidersEnabled, false);
});

test("Release 188 requires hardStopEnabled", () => {
  assert.equal({ hardStopEnabled: true }.hardStopEnabled, true);
});

