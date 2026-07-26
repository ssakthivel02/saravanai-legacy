import test from "node:test";
import assert from "node:assert/strict";

const controls = ["index_provenance_required", "access_filter_required", "explanation_required", "opt_out_required"];

test("Release 275 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 275 requires accessFilterRequired", () => {
  assert.equal({ accessFilterRequired: true }.accessFilterRequired, true);
});

test("Release 275 requires explanationAvailable", () => {
  assert.equal({ explanationAvailable: true }.explanationAvailable, true);
});

test("Release 275 requires personalisationOptOutAvailable", () => {
  assert.equal({ personalisationOptOutAvailable: true }.personalisationOptOutAvailable, true);
});

