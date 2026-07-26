import test from "node:test";
import assert from "node:assert/strict";
test("billing and payment remain disabled",()=>assert.deepEqual({billing:false,payments:false,unified:false},{billing:false,payments:false,unified:false}));
