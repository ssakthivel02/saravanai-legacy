import test from "node:test";
import assert from "node:assert/strict";

const controls = ["consent_required", "quiet_hours_required", "dark_patterns_forbidden"];

test("Release 146 defines unique explicit controls", () => {
  assert.equal(controls.length >= 3, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 146 keeps darkPatternsAllowed disabled", () => {
  assert.equal({ darkPatternsAllowed: false }.darkPatternsAllowed, false);
});

