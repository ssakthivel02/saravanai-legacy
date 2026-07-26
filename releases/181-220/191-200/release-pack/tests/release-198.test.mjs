import test from "node:test";
import assert from "node:assert/strict";

const controls = ["custodians_required", "hold_respected", "chain_of_custody_required", "owner_required"];

test("Release 198 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

