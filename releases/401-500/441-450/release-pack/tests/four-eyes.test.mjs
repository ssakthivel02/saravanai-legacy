import test from "node:test";
import assert from "node:assert/strict";
const valid=(requester,approver,evidence)=>requester!==approver&&Boolean(approver)&&evidence.length>0;
test("self-approval denied",()=>assert.equal(valid("a","a",["e"]),false));
test("independent approval accepted",()=>assert.equal(valid("a","b",["e"]),true));
