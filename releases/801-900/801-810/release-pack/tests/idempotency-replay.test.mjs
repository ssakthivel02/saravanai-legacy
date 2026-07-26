import test from "node:test";
import assert from "node:assert/strict";
const allowed=(existing,payload)=>!existing||existing.payload===payload;
test("same replay accepted",()=>assert.equal(allowed({payload:"a"},"a"),true));
test("different replay rejected",()=>assert.equal(allowed({payload:"a"},"b"),false));
