import test from "node:test"; import assert from "node:assert/strict";
const allowed=(a,t,r=[])=>r.includes("owner")||a===t;
test("cross tenant member is denied",()=>assert.equal(allowed("a","b",["member"]),false));
test("same tenant member is allowed",()=>assert.equal(allowed("a","a",["member"]),true));
