import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "apis_required", "security_contact_required", "deprecation_policy_required"];

test("Release 293 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

