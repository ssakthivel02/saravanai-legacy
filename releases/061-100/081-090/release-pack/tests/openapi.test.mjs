import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const api = await readFile(new URL("../openapi/releases-081-090.yaml", import.meta.url), "utf8");
test("OpenAPI exposes every release resource", () => {
  const expected = ["privacy-rules", "regional-data-policies", "safeguard-profiles", "event-safety-plans", "transparency-records", "ai-impact-assessments", "regulatory-obligations", "abuse-assessments", "threat-indicators", "global-trust-gates"];
  for (const resource of expected) assert.equal(api.includes(`/api/v1/${resource}`), true);
});
