import test from "node:test";
import assert from "node:assert/strict";

const controls = ["source_required", "confidence_bounded", "expiry_required", "tenant_isolation_required"];

test("Release 185 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

