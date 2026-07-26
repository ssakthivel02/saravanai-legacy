import test from "node:test";
import assert from "node:assert/strict";

const controls = ["open_format_required", "integrity_hash_required", "approval_for_restricted_export"];

test("Release 172 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

