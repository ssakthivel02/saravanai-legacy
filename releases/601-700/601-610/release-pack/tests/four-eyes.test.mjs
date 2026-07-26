import test from "node:test";
import assert from "node:assert/strict";
const valid=(r,a,e)=>r!==a&&Boolean(a)&&e.length>0;
test("self-approval denied",()=>assert.equal(valid("a","a",["e"]),false));
test("independent approval accepted",()=>assert.equal(valid("a","b",["e"]),true));
