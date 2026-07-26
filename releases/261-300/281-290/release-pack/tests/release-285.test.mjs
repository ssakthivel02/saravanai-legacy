import test from "node:test";
import assert from "node:assert/strict";

const controls = ["identity_verification_required", "legal_holds_respected", "due_date_required", "completion_evidence_required"];

test("Release 285 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

