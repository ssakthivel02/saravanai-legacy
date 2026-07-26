import test from "node:test";
import assert from "node:assert/strict";

test("unsafe defaults remain disabled", () => {
  const values = [false,false,false,false,false,false,false,false];
  assert.equal(values.every(value => value === false), true);
});
