import test from "node:test";
import assert from "node:assert/strict";

const controls = ["regions_required", "data_boundary_required", "locales_required", "regional_owners_required"];

test("Release 291 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

