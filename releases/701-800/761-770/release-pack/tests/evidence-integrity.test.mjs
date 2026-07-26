import test from "node:test";
import assert from "node:assert/strict";
test("valid SHA-256",()=>assert.equal(/^[a-f0-9]{64}$/i.test("a".repeat(64)),true));
test("invalid SHA-256 rejected",()=>assert.equal(/^[a-f0-9]{64}$/i.test("bad"),false));
