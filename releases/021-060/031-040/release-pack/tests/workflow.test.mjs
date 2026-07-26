import test from "node:test";import assert from "node:assert/strict";
const valid=v=>v>=1&&v<=5;
test("workflow attempts bounded",()=>{assert.equal(valid(3),true);assert.equal(valid(8),false);});
