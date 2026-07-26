import test from "node:test";
import assert from "node:assert/strict";
function allowed(actorTenant, targetTenant, roles = []) {
  return roles.includes("owner") || actorTenant === targetTenant;
}
test("cross-tenant member access is denied", () => assert.equal(allowed("a", "b", ["member"]), false));
test("same-tenant access is allowed", () => assert.equal(allowed("a", "a", ["member"]), true));
test("owner override is explicit", () => assert.equal(allowed("a", "b", ["owner"]), true));
