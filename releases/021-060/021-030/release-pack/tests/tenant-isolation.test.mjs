import test from "node:test";
import assert from "node:assert/strict";
function sameTenant(actor, target){ return actor.roles.includes("owner") || actor.tenantId === target; }
test("cross tenant member is denied", () => assert.equal(sameTenant({tenantId:"a",roles:["member"]},"b"), false));
test("same tenant member is allowed", () => assert.equal(sameTenant({tenantId:"a",roles:["member"]},"a"), true));
