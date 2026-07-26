import test from "node:test";
import assert from "node:assert/strict";

const controls = ["sources_required", "limitations_disclosed", "corrections_supported", "redress_available"];

test("Release 279 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

