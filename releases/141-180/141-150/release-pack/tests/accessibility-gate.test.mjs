import test from "node:test"; import assert from "node:assert/strict";
const releasable=failures=>failures.length===0;
test("blocking accessibility failure prevents release",()=>assert.equal(releasable(["keyboard trap"]),false));
