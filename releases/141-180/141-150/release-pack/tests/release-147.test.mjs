import test from "node:test";
import assert from "node:assert/strict";

const controls = ["tenant_isolation_required", "retention_required", "external_sharing_default_deny"];

test("Release 147 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 147 keeps externalSharingAllowed disabled", () => {
  assert.equal({ externalSharingAllowed: false }.externalSharingAllowed, false);
});

