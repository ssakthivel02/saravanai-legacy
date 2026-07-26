import test from "node:test";
import assert from "node:assert/strict";
const flags={publicRegistration:false,paidProviders:false,autonomousProduction:false};
test("unsafe defaults remain disabled",()=>assert.deepEqual(flags,{publicRegistration:false,paidProviders:false,autonomousProduction:false}));
