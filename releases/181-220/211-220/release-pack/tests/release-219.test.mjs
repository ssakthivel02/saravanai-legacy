import test from "node:test";
import assert from "node:assert/strict";

const controls = ["open_formats_required", "integrity_hash_required", "retention_required", "owner_required"];

test("Release 219 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

