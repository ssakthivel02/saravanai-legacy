import test from "node:test";
import assert from "node:assert/strict";
const ready=v=>Boolean(v.rollbackRef)&&v.evidenceRefs.length>0&&v.owner.length>0;
test("rollback needs owner and evidence",()=>assert.equal(ready({rollbackRef:"r",evidenceRefs:["e"],owner:"o"}),true));
