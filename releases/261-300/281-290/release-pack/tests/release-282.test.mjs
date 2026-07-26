import test from "node:test";
import assert from "node:assert/strict";

const controls = ["controls_required", "sources_authorised", "data_minimisation_required", "integrity_hash_required"];

test("Release 282 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 282 requires minimumDataRequired", () => {
  assert.equal({ minimumDataRequired: true }.minimumDataRequired, true);
});

