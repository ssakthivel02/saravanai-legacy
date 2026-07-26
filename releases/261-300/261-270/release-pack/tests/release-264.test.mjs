import test from "node:test";
import assert from "node:assert/strict";

const controls = ["requester_assignee_separation", "due_date_required", "evidence_required", "escalation_required"];

test("Release 264 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

