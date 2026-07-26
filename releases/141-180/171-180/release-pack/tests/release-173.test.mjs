import test from "node:test";
import assert from "node:assert/strict";

const controls = ["security_contact_required", "scope_catalogue_required", "conduct_policy_required"];

test("Release 173 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

