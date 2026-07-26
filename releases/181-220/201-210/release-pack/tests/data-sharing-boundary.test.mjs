import test from "node:test";
import assert from "node:assert/strict";

test("data provider and consumer tenants must differ", () => {
  const valid = (provider, consumer) => provider !== consumer;
  assert.equal(valid("a","a"), false);
  assert.equal(valid("a","b"), true);
});
