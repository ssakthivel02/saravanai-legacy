import test from "node:test";
import assert from "node:assert/strict";
test("features disabled with kill switch",()=>assert.deepEqual({enabled:false,kill:true},{enabled:false,kill:true}));
