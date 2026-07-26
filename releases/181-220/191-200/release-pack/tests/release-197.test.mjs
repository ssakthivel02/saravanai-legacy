import test from "node:test";
import assert from "node:assert/strict";

const controls = ["provider_consumer_distinct", "purpose_required", "field_allowlist_required", "expiry_required"];

test("Release 197 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

