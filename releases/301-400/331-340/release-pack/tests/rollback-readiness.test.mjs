import test from "node:test";
import assert from "node:assert/strict";

const ready = value =>
  Boolean(value.rollbackRef) &&
  value.evidenceRefs.length > 0 &&
  value.owner.length > 0;

test("material changes require rollback evidence and ownership", () => {
  assert.equal(ready({
    rollbackRef: "runbook-1",
    evidenceRefs: ["test-1"],
    owner: "service-owner"
  }), true);
});
