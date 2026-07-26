import test from "node:test";
import assert from "node:assert/strict";

const blocked = new Set(["prompt","content","document","file","email","phone","secret","token"]);

test("sensitive fields are excluded from routine metadata", () => {
  const input = { requestId: "r1", prompt: "private", token: "secret", status: "ok" };
  const safe = Object.fromEntries(
    Object.entries(input).filter(([key]) => !blocked.has(key.toLowerCase()))
  );
  assert.deepEqual(safe, { requestId: "r1", status: "ok" });
});
