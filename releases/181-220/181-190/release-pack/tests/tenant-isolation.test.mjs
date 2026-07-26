import test from "node:test";
import assert from "node:assert/strict";

function allowed(actorTenant, targetTenant, roles = []) {
  return roles.includes("owner") || actorTenant === targetTenant;
}

test("cross-tenant member is denied", () => assert.equal(allowed("a","b",["member"]), false));
test("same-tenant member is allowed", () => assert.equal(allowed("a","a",["member"]), true));
