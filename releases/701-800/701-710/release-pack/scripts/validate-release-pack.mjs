import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "policies/research-integrity.json", "openapi/releases-701-710.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/EVALUATION_CAMPAIGN_TEMPLATE.md", "evidence/RESEARCH_QUALITY_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_701_AI_EVALUATION_DATASET_REGISTRY.md", "docs/RELEASE_702_MODEL_CAPABILITY_BENCHMARK_FRAMEWORK.md", "docs/RELEASE_703_SAFETY_EVALUATION_AND_HARM_TAXONOMY.md", "docs/RELEASE_704_PROMPT_INJECTION_AND_TOOL_ABUSE_TESTING.md", "docs/RELEASE_705_HALLUCINATION_AND_FACTUALITY_EVALUATION_V2.md", "docs/RELEASE_706_FAIRNESS_AND_ACCESSIBILITY_EVALUATION.md", "docs/RELEASE_707_ADVERSARIAL_RED_TEAM_CAMPAIGN_MANAGEMENT.md", "docs/RELEASE_708_MODEL_REGRESSION_AND_RELEASE_COMPARISON.md", "docs/RELEASE_709_EVALUATION_EVIDENCE_AND_DECISION_DASHBOARD.md", "docs/RELEASE_710_AI_EVALUATION_AND_RED_TEAM_ASSURANCE_GATE.md", "schemas/release-701.schema.json", "schemas/release-702.schema.json", "schemas/release-703.schema.json", "schemas/release-704.schema.json", "schemas/release-705.schema.json", "schemas/release-706.schema.json", "schemas/release-707.schema.json", "schemas/release-708.schema.json", "schemas/release-709.schema.json", "schemas/release-710.schema.json"];

async function exists(path) {
  try { return (await stat(join(root, path))).isFile(); }
  catch { return false; }
}

for (const path of required) {
  if (!await exists(path)) throw new Error(`Missing required file: ${path}`);
}

async function walk(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(path));
    else output.push(path);
  }
  return output;
}

const files = await walk(root);
const forbidden = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /ghp_[A-Za-z0-9]{30,}/,
  /sk-[A-Za-z0-9]{20,}/
];

for (const file of files) {
  const text = await readFile(file, "utf8").catch(() => null);
  if (text === null) continue;
  const selfTest = file.endsWith("redaction.ts") || file.endsWith("validate-release-pack.mjs");
  for (const pattern of forbidden) {
    if (!selfTest && pattern.test(text)) throw new Error(`Secret-shaped content in ${relative(root,file)}`);
  }
}

const counts = {
  migrations: files.filter(file => file.includes("/migrations/") && file.endsWith(".sql")).length,
  documents: files.filter(file => file.includes("/docs/") && file.endsWith(".md")).length,
  schemas: files.filter(file => file.includes("/schemas/") && file.endsWith(".json")).length,
  releaseContracts: files.filter(file => /\/release\d+\/contracts\.ts$/.test(file)).length,
  releasePolicies: files.filter(file => /\/release\d+\/policy\.ts$/.test(file)).length,
  releaseServices: files.filter(file => /\/release\d+\/service\.ts$/.test(file)).length,
  releaseRoutes: files.filter(file => /\/release\d+\/route\.ts$/.test(file)).length,
  releaseTelemetry: files.filter(file => /\/release\d+\/telemetry\.ts$/.test(file)).length
};

for (const [name,count] of Object.entries(counts)) {
  if (count !== 10) throw new Error(`Expected 10 ${name}, found ${count}`);
}

console.log(`Release pack validation passed: ${files.length} files`);
