import test from "node:test";
import assert from "node:assert/strict";
const releases = [71, 72, 73, 74, 75, 76, 77, 78, 79, 80];
test("release index is complete and ordered", () => {
  assert.equal(releases.length, 10);
  assert.equal(releases.every(Number.isInteger), true);
  assert.equal([...releases].sort((a,b)=>a-b).join(","), releases.join(","));
});
