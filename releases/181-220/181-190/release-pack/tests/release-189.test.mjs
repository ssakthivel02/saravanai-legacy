import test from "node:test";
import assert from "node:assert/strict";

const controls = ["impact_assessment_required", "canary_required", "rollback_required", "approval_required"];

test("Release 189 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

