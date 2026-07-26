import test from "node:test";
import assert from "node:assert/strict";
const allowed=(actor,target,roles=[])=>roles.includes("owner")||actor===target;
test("cross tenant denied",()=>assert.equal(allowed("a","b",["member"]),false));
test("same tenant allowed",()=>assert.equal(allowed("a","a",["member"]),true));
