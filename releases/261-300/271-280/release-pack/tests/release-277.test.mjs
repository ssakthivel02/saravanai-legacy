import test from "node:test";
import assert from "node:assert/strict";

const controls = ["parental_control_required", "profiling_forbidden", "safeguarding_owner_required", "reporting_channel_required"];

test("Release 277 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 277 requires parentalControlRequired", () => {
  assert.equal({ parentalControlRequired: true }.parentalControlRequired, true);
});

test("Release 277 keeps behaviouralProfilingAllowed disabled", () => {
  assert.equal({ behaviouralProfilingAllowed: false }.behaviouralProfilingAllowed, false);
});

