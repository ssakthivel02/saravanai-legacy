import test from "node:test";
import assert from "node:assert/strict";
const blocked=new Set(["prompt","content","document","file","email","phone","secret","token"]);
test("sensitive metadata excluded",()=>{const i={requestId:"r",prompt:"p",token:"t",status:"ok"};const s=Object.fromEntries(Object.entries(i).filter(([k])=>!blocked.has(k)));assert.deepEqual(s,{requestId:"r",status:"ok"});});
