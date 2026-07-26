import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "expiry_required", "kill_switch_required"];

test("Release 164 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

