import test from "node:test";
import assert from "node:assert/strict";
const releases = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
test("release index is complete and ordered", () => {
  assert.equal(releases.length, 10);
  assert.equal(releases.every(Number.isInteger), true);
  assert.equal([...releases].sort((a,b)=>a-b).join(","), releases.join(","));
});
