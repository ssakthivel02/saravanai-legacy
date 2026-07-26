import test from "node:test";
import assert from "node:assert/strict";

const valid = (requester, approver, evidence) =>
  requester !== approver && Boolean(approver) && evidence.length > 0;

test("self-approval is denied", () => {
  assert.equal(valid("a", "a", ["evidence"]), false);
});

test("independent approval with evidence is valid", () => {
  assert.equal(valid("a", "b", ["evidence"]), true);
});
