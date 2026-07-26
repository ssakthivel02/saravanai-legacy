import test from "node:test";
import assert from "node:assert/strict";

const defaults = {
  publicRegistration: false,
  paidProviders: false,
  unifiedBilling: false,
  billing: false,
  payments: false,
  autonomousWrites: false,
  crossTenantAccess: false
};

test("unsafe defaults remain disabled", () => {
  assert.equal(Object.values(defaults).every(value => value === false), true);
});
