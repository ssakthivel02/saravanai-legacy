import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const api = await readFile(new URL("../openapi/releases-071-080.yaml", import.meta.url), "utf8");
test("OpenAPI exposes every release resource", () => {
  const expected = ["marketplace-connectors", "business-processes", "support-cases", "secure-messages", "publications", "learning-paths", "metric-definitions", "data-products", "supplier-assessments", "ecosystem-gates"];
  for (const resource of expected) assert.equal(api.includes(`/api/v1/${resource}`), true);
});
