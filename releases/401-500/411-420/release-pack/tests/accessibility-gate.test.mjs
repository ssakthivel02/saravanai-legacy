import test from "node:test";
import assert from "node:assert/strict";
const releasable=f=>f.length===0;
test("blocking accessibility failures stop release",()=>{assert.equal(releasable(["keyboard trap"]),false);assert.equal(releasable([]),true);});
