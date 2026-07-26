import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const api = await readFile(new URL("../openapi/releases-061-070.yaml", import.meta.url), "utf8");
test("OpenAPI exposes every release resource", () => {
  const expected = ["model-route-policies", "multimodal-assets", "audio-transcripts", "vision-safety-assessments", "evidence-claims", "ontology-contracts", "decision-records", "scenario-definitions", "code-findings", "intelligence-gates"];
  for (const resource of expected) assert.equal(api.includes(`/api/v1/${resource}`), true);
});
