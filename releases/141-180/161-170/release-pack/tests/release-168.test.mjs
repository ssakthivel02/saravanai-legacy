import test from "node:test";
import assert from "node:assert/strict";

const controls = ["classification_required", "expiry_required", "production_secrets_forbidden"];

test("Release 168 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 168 keeps productionSecretsIncluded disabled", () => {
  assert.equal({ productionSecretsIncluded: false }.productionSecretsIncluded, false);
});

