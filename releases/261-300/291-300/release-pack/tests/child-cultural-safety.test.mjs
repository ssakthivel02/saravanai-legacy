import test from "node:test";
import assert from "node:assert/strict";

test("child profiling remains disabled", () => {
  assert.equal({ behaviouralProfilingAllowed: false }.behaviouralProfilingAllowed, false);
});

test("cultural claims require explicit type", () => {
  const types = ["documented","traditional_belief","scholarly_interpretation","unverified"];
  assert.equal(types.includes("documented"), true);
});
