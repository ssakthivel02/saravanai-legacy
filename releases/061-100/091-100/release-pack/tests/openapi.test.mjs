import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const api = await readFile(new URL("../openapi/releases-091-100.yaml", import.meta.url), "utf8");
test("OpenAPI exposes every release resource", () => {
  const expected = ["agent-nodes", "remediation-plans", "verification-suites", "progressive-rollouts", "digital-twins", "capacity-profiles", "carbon-aware-policies", "continuity-exit-plans", "evidence-packages", "enterprise-launch-decisions"];
  for (const resource of expected) assert.equal(api.includes(`/api/v1/${resource}`), true);
});
