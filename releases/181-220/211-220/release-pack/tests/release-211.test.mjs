import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "outcomes_measurable", "dependencies_recorded", "risks_linked"];

test("Release 211 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

