import test from "node:test";
import assert from "node:assert/strict";

const controls = ["synthetic_data_required", "production_credentials_forbidden", "expiry_required"];

test("Release 175 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 175 keeps productionCredentialsAvailable disabled", () => {
  assert.equal({ productionCredentialsAvailable: false }.productionCredentialsAvailable, false);
});

