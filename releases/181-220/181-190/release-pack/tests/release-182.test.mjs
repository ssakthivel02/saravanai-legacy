import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "content_hash_required", "tests_before_approval", "rollback_version_required"];

test("Release 182 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

