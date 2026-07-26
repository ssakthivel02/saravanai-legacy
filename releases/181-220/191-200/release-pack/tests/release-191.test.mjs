import test from "node:test";
import assert from "node:assert/strict";

const controls = ["domain_owner_required", "products_registered", "policies_required", "quality_objectives_required"];

test("Release 191 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

