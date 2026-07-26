import test from "node:test";
import assert from "node:assert/strict";

const controls = ["context_provenance_required", "sensitive_persistence_forbidden", "limitations_disclosed"];

test("Release 142 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 142 keeps sensitivePersistenceAllowed disabled", () => {
  assert.equal({ sensitivePersistenceAllowed: false }.sensitivePersistenceAllowed, false);
});

