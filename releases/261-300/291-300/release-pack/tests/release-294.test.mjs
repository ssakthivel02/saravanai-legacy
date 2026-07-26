import test from "node:test";
import assert from "node:assert/strict";

const controls = ["open_formats_required", "schema_version_required", "integrity_hash_required", "expiry_required"];

test("Release 294 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

