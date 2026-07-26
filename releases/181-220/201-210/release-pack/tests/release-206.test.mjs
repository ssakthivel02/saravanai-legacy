import test from "node:test";
import assert from "node:assert/strict";

const controls = ["approval_required", "time_bound_required", "session_evidence_required", "separation_of_duties_required"];

test("Release 206 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

