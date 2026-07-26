import test from "node:test";
import assert from "node:assert/strict";
test("billing and payments disabled",()=>assert.deepEqual({billing:false,payments:false,unified:false},{billing:false,payments:false,unified:false}));
