import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "policies/research-integrity.json", "openapi/releases-771-780.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/EVALUATION_CAMPAIGN_TEMPLATE.md", "evidence/RESEARCH_QUALITY_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_771_ENTERPRISE_DATA_PRODUCT_REGISTRY.md", "docs/RELEASE_772_DATA_CONTRACT_AND_SCHEMA_EVOLUTION.md", "docs/RELEASE_773_MASTER_AND_REFERENCE_DATA_GOVERNANCE.md", "docs/RELEASE_774_ENTERPRISE_SEMANTIC_AND_METRICS_LAYER.md", "docs/RELEASE_775_DATA_PRODUCT_ACCESS_AND_USAGE_CONTROL.md", "docs/RELEASE_776_DATA_QUALITY_RULES_AND_OBSERVABILITY.md", "docs/RELEASE_777_DATA_LINEAGE_IMPACT_AND_CHANGE_ANALYSIS.md", "docs/RELEASE_778_DATA_PRODUCT_MARKETPLACE_AND_DISCOVERY.md", "docs/RELEASE_779_DATA_PRODUCT_DEPRECATION_AND_PORTABILITY.md", "docs/RELEASE_780_DATA_PRODUCTS_AND_SEMANTIC_LAYER_ASSURANCE_GATE.md", "schemas/release-771.schema.json", "schemas/release-772.schema.json", "schemas/release-773.schema.json", "schemas/release-774.schema.json", "schemas/release-775.schema.json", "schemas/release-776.schema.json", "schemas/release-777.schema.json", "schemas/release-778.schema.json", "schemas/release-779.schema.json", "schemas/release-780.schema.json"];

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
