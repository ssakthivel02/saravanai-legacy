import test from "node:test";
import assert from "node:assert/strict";

const controls = ["owner_required", "contract_required", "sla_required", "portable_format_required"];

test("Release 199 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

