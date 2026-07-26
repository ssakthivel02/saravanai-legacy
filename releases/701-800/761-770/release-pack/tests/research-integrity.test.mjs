import test from "node:test";
import assert from "node:assert/strict";
const valid=c=>Boolean(c.source)&&Boolean(c.location)&&Boolean(c.checkedAt);
test("claims require source location and verification time",()=>assert.equal(valid({source:"s",location:"p1",checkedAt:"2026-01-01"}),true));
