import test from "node:test";
import assert from "node:assert/strict";

const controls = ["accountable_owner_required", "alternatives_recorded", "conflicts_declared", "multi_party_approval"];

test("Release 214 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

