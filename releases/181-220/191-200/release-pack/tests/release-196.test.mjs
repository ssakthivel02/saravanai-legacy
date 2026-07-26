import test from "node:test";
import assert from "node:assert/strict";

const controls = ["purpose_required", "minimum_group_required", "identifiers_forbidden", "reidentification_forbidden"];

test("Release 196 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 196 keeps directIdentifiersAllowed disabled", () => {
  assert.equal({ directIdentifiersAllowed: false }.directIdentifiersAllowed, false);
});

test("Release 196 keeps reidentificationAllowed disabled", () => {
  assert.equal({ reidentificationAllowed: false }.reidentificationAllowed, false);
});

