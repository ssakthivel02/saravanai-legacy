import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "permissions_required", "version_required"];

test("Release 161 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

