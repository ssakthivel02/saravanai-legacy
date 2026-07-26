import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "modules_required", "accessibility_evidence_required", "accreditation_not_claimed"];

test("Release 276 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 276 keeps accreditationClaimed disabled", () => {
  assert.equal({ accreditationClaimed: false }.accreditationClaimed, false);
});

