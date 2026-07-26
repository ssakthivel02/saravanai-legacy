import test from "node:test";
import assert from "node:assert/strict";

function valid(requester, approver, evidence) {
  return requester !== approver && Boolean(approver) && evidence.length > 0;
}

test("self-approval is denied", () => assert.equal(valid("a","a",["e"]), false));
test("independent approval with evidence is valid", () => assert.equal(valid("a","b",["e"]), true));
