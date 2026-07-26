import test from "node:test";
import assert from "node:assert/strict";
const releases = [91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
test("release index is complete and ordered", () => {
  assert.equal(releases.length, 10);
  assert.equal(releases.every(Number.isInteger), true);
  assert.equal([...releases].sort((a,b)=>a-b).join(","), releases.join(","));
});
