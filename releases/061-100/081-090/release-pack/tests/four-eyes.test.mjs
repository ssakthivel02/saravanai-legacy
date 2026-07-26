import test from "node:test";
import assert from "node:assert/strict";
function valid(requestedBy, decidedBy, evidenceIds, expiresAt) {
  return requestedBy !== decidedBy && evidenceIds.length > 0 && new Date(expiresAt).getTime() > Date.now();
}
test("self approval is denied", () => assert.equal(valid("a", "a", ["e1"], "2999-01-01"), false));
test("separate current evidenced approval is accepted", () => assert.equal(valid("a", "b", ["e1"], "2999-01-01"), true));
