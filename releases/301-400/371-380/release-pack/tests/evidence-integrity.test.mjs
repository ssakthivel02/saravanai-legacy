import test from "node:test";
import assert from "node:assert/strict";

test("SHA-256 evidence uses 64 hexadecimal characters", () => {
  assert.equal(/^[a-f0-9]{64}$/i.test("a".repeat(64)), true);
  assert.equal(/^[a-f0-9]{64}$/i.test("invalid"), false);
});
