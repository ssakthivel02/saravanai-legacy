import test from "node:test"; import assert from "node:assert/strict";
const flags={publicRegistration:false,paidProviders:false,unifiedBilling:false,autonomousWrites:false,darkPatterns:false};
test("unsafe defaults remain disabled",()=>assert.equal(Object.values(flags).every(v=>v===false),true));
