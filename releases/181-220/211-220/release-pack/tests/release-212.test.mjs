import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "decision_evidence_required", "review_date_required", "exception_governed"];

test("Release 212 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

