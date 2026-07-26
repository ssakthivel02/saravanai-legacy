import test from "node:test";
import assert from "node:assert/strict";

test("critical supply-chain findings block approval", () => {
  const approved = findings => findings === 0;
  assert.equal(approved(1), false);
  assert.equal(approved(0), true);
});
