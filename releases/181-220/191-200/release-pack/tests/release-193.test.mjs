import test from "node:test";
import assert from "node:assert/strict";

const controls = ["schema_version_required", "compatibility_declared", "owner_required", "privacy_classification_required"];

test("Release 193 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

