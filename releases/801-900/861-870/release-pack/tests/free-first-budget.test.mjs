import test from "node:test";
import assert from "node:assert/strict";
const available=v=>v.freeFirst&&v.hardStop&&v.used<v.max;
test("free-first hard stop enforced",()=>{assert.equal(available({freeFirst:true,hardStop:true,used:5,max:10}),true);assert.equal(available({freeFirst:true,hardStop:true,used:10,max:10}),false);});
