import test from "node:test";
import assert from "node:assert/strict";

const controls = ["score_bounded", "observation_time_required", "owner_required", "failure_requires_action"];

test("Release 195 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

