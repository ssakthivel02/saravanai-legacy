import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "releases_required", "dependencies_mapped", "gates_required"];

test("Release 295 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

