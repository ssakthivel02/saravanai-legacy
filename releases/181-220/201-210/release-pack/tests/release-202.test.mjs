import test from "node:test";
import assert from "node:assert/strict";

const controls = ["source_verification_required", "timestamp_required", "verifier_required", "correction_supported"];

test("Release 202 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

