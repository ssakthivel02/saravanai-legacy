import test from "node:test";
import assert from "node:assert/strict";
const defaults=[false,false,false,false];
test("unsafe capabilities remain disabled",()=>assert.equal(defaults.every(v=>v===false),true));
