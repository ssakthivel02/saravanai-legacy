import test from "node:test";
import assert from "node:assert/strict";

const unsafeFlags = {
  publicRegistration: false,
  paidProviders: false,
  unifiedBilling: false,
  billing: false,
  payments: false,
  anonymousWrites: false,
  autonomousWrites: false,
  invasiveMonitoring: false,
  unsupportedCertificationClaims: false
};

test("unsafe defaults remain disabled", () => {
  assert.equal(Object.values(unsafeFlags).every(value => value === false), true);
});
