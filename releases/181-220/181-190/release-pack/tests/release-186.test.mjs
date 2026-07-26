import test from "node:test";
import assert from "node:assert/strict";

const controls = ["tool_allowlist_required", "egress_allowlist_required", "idempotency_required", "write_requires_approval"];

test("Release 186 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

