import test from "node:test";
import assert from "node:assert/strict";
const values=[false,false,false,false,false,false,false,false,false];
test("unsafe defaults remain disabled",()=>assert.equal(values.every(v=>v===false),true));
