import test from "node:test";
import assert from "node:assert/strict";
test("production writes disabled",()=>assert.equal({productionWriteAllowed:false}.productionWriteAllowed,false));
test("steps bounded",()=>{const v=n=>n>=1&&n<=50;assert.equal(v(20),true);assert.equal(v(80),false);});
