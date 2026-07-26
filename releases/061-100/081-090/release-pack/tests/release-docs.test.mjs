import test from "node:test";
import assert from "node:assert/strict";
const releases = [81, 82, 83, 84, 85, 86, 87, 88, 89, 90];
test("release index is complete and ordered", () => {
  assert.equal(releases.length, 10);
  assert.equal(releases.every(Number.isInteger), true);
  assert.equal([...releases].sort((a,b)=>a-b).join(","), releases.join(","));
});
