import test from "node:test";
import assert from "node:assert/strict";

const ready = value =>
  Boolean(value.accountableOwner) &&
  value.evidenceDomains.length > 0 &&
  value.approvedBy.length > 1;

test("GA decision requires evidence and multiple approvers", () => {
  assert.equal(ready({
    accountableOwner: "owner",
    evidenceDomains: ["security","operations"],
    approvedBy: ["a","b"]
  }), true);
});
