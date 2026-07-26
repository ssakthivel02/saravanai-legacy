import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/control-catalogue.json", "openapi/releases-061-070.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/SECURITY_REVIEW_TEMPLATE.md", "src/release061/model.ts", "src/release061/policy.ts", "docs/RELEASE_061_RESPONSIBLE_MODEL_ROUTING.md", "migrations/0061_responsible_model_routing.sql", "src/release062/model.ts", "src/release062/policy.ts", "docs/RELEASE_062_MULTIMODAL_INTELLIGENCE_RUNTIME.md", "migrations/0062_multimodal_intelligence_runtime.sql", "src/release063/model.ts", "src/release063/policy.ts", "docs/RELEASE_063_SPEECH_AND_AUDIO_INTELLIGENCE.md", "migrations/0063_speech_and_audio_intelligence.sql", "src/release064/model.ts", "src/release064/policy.ts", "docs/RELEASE_064_VISION_AND_MEDIA_SAFETY.md", "migrations/0064_vision_and_media_safety.sql", "src/release065/model.ts", "src/release065/policy.ts", "docs/RELEASE_065_CITATION_GRAPH_AND_EVIDENCE_SYNTHESIS.md", "migrations/0065_citation_graph_and_evidence_synthesis.sql", "src/release066/model.ts", "src/release066/policy.ts", "docs/RELEASE_066_ENTERPRISE_ONTOLOGY_AND_SEMANTIC_CONTRACTS.md", "migrations/0066_enterprise_ontology_and_semantic_contracts.sql", "src/release067/model.ts", "src/release067/policy.ts", "docs/RELEASE_067_DECISION_INTELLIGENCE_AND_EXPLAINABILITY.md", "migrations/0067_decision_intelligence_and_explainability.sql", "src/release068/model.ts", "src/release068/policy.ts", "docs/RELEASE_068_SCENARIO_PLANNING_AND_SIMULATION.md", "migrations/0068_scenario_planning_and_simulation.sql", "src/release069/model.ts", "src/release069/policy.ts", "docs/RELEASE_069_SECURE_CODE_INTELLIGENCE.md", "migrations/0069_secure_code_intelligence.sql", "src/release070/model.ts", "src/release070/policy.ts", "docs/RELEASE_070_INTELLIGENCE_ASSURANCE_GATE.md", "migrations/0070_intelligence_assurance_gate.sql"];

async function exists(path) {
  try { return (await stat(join(root, path))).isFile(); }
  catch { return false; }
}

for (const path of required) {
  if (!await exists(path)) throw new Error(`Missing required file: ${path}`);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(path)); else out.push(path);
  }
  return out;
}

const files = await walk(root);
const forbiddenNames = [".env", "id_rsa", "credentials.json", "service-account.json"];
for (const file of files) {
  const lower = file.toLowerCase();
  if (forbiddenNames.some(name => lower.endsWith(name))) throw new Error(`Forbidden credential file: ${relative(root, file)}`);
  const text = await readFile(file, "utf8").catch(() => null);
  if (text === null) continue;
  if (text.includes("BEGIN " + "PRIVATE KEY")) throw new Error(`Private key material in ${relative(root, file)}`);
}

console.log(`Release pack 061-070 validation passed: ${files.length} files`);
