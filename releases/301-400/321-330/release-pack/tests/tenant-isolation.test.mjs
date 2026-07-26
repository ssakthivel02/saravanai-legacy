import test from "node:test";
import assert from "node:assert/strict";

const allowed = (actorTenant, targetTenant, roles = []) =>
  roles.includes("owner") || actorTenant === targetTenant;

test("cross-tenant member access is denied", () => {
  assert.equal(allowed("tenant-a", "tenant-b", ["member"]), false);
});

test("same-tenant member access is allowed", () => {
  assert.equal(allowed("tenant-a", "tenant-a", ["member"]), true);
});
