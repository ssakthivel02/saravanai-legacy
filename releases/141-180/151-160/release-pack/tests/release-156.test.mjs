import test from "node:test";
import assert from "node:assert/strict";

const controls = ["catalogue_item_required", "idempotency_required", "write_requires_approval"];

test("Release 156 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

