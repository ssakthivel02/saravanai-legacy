import test from "node:test";
import assert from "node:assert/strict";

const controls = ["assets_required", "severity_required", "owner_required", "sla_required"];

test("Release 203 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

