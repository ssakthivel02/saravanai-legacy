import test from "node:test"; import assert from "node:assert/strict";
test("sha256 requires 64 hex chars",()=>{assert.equal(/^[a-f0-9]{64}$/i.test("a".repeat(64)),true);assert.equal(/^[a-f0-9]{64}$/i.test("bad"),false);});
