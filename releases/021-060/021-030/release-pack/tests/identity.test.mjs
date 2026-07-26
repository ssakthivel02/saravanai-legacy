import test from "node:test";
import assert from "node:assert/strict";
const roles = { owner:["*"], member:["workspace:read","workspace:use"] };
test("member cannot gain tenant administration", () => assert.equal(roles.member.includes("tenant:write"), false));
test("owner wildcard is explicit", () => assert.deepEqual(roles.owner, ["*"]));
