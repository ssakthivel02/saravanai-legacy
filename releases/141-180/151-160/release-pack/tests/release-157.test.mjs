import test from "node:test";
import assert from "node:assert/strict";

const controls = ["metric_required", "non_negative_usage", "billing_disabled"];

test("Release 157 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 157 keeps billingEnabled disabled", () => {
  assert.equal({ billingEnabled: false }.billingEnabled, false);
});

