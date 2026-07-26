import test from "node:test";
import assert from "node:assert/strict";

const controls = ["notice_required", "sunset_requires_migration_guide", "owner_communication_required"];

test("Release 177 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

