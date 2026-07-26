import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "policies/research-integrity.json", "openapi/releases-711-720.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/EVALUATION_CAMPAIGN_TEMPLATE.md", "evidence/RESEARCH_QUALITY_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_711_RESEARCH_QUESTION_AND_SCOPE_REGISTRY.md", "docs/RELEASE_712_SOURCE_DISCOVERY_AND_AUTHORITY_RANKING.md", "docs/RELEASE_713_PRIMARY_SOURCE_ACQUISITION_AND_PRESERVATION.md", "docs/RELEASE_714_CLAIM_EVIDENCE_AND_CITATION_GRAPH.md", "docs/RELEASE_715_RESEARCH_SYNTHESIS_AND_ARGUMENT_MAPPING.md", "docs/RELEASE_716_FACT_VERIFICATION_AND_TEMPORAL_VALIDATION.md", "docs/RELEASE_717_RESEARCH_QUALITY_AND_BIAS_REVIEW.md", "docs/RELEASE_718_RESEARCH_REPORT_AND_BRIEFING_COMPOSER.md", "docs/RELEASE_719_RESEARCH_CORRECTION_AND_RETRACTION_WORKFLOW.md", "docs/RELEASE_720_DEEP_RESEARCH_ASSURANCE_GATE.md", "schemas/release-711.schema.json", "schemas/release-712.schema.json", "schemas/release-713.schema.json", "schemas/release-714.schema.json", "schemas/release-715.schema.json", "schemas/release-716.schema.json", "schemas/release-717.schema.json", "schemas/release-718.schema.json", "schemas/release-719.schema.json", "schemas/release-720.schema.json"];

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
