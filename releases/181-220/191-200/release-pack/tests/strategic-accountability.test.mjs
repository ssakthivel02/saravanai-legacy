import test from "node:test";
import assert from "node:assert/strict";

test("material decisions require an owner and alternatives", () => {
  const valid = value => Boolean(value.owner) && value.alternatives.length > 0;
  assert.equal(valid({ owner: "board", alternatives: ["A","B"] }), true);
  assert.equal(valid({ owner: "", alternatives: [] }), false);
});
