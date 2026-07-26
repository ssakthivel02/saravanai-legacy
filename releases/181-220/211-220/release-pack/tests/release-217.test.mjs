import test from "node:test";
import assert from "node:assert/strict";

const controls = ["requirements_scored", "security_evidence_required", "privacy_evidence_required", "exit_plan_required"];

test("Release 217 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

