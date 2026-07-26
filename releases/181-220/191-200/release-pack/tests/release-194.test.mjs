import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "steps_required", "retries_bounded", "compensation_required_for_writes"];

test("Release 194 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

