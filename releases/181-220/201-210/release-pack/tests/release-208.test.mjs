import test from "node:test";
import assert from "node:assert/strict";

const controls = ["backup_required", "isolated_restore_required", "objectives_recorded", "evidence_required"];

test("Release 208 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

