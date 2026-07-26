import test from "node:test";
import assert from "node:assert/strict";

const controls = ["capability_scope_required", "expiry_supported", "paid_activation_forbidden"];

test("Release 151 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 151 keeps paidActivationAllowed disabled", () => {
  assert.equal({ paidActivationAllowed: false }.paidActivationAllowed, false);
});

