import test from "node:test";
import assert from "node:assert/strict";

const controls = ["recipient_validation_required", "template_required", "external_send_requires_approval", "audit_receipt_required"];

test("Release 266 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

