import test from "node:test";
import assert from "node:assert/strict";

const controls = ["tenant_scope_required", "module_permissions_required", "session_boundary_required"];

test("Release 141 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

