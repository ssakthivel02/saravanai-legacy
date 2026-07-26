import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "policies/research-integrity.json", "openapi/releases-761-770.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/EVALUATION_CAMPAIGN_TEMPLATE.md", "evidence/RESEARCH_QUALITY_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_761_HYBRID_INFRASTRUCTURE_SERVICE_CATALOGUE.md", "docs/RELEASE_762_LANDING_ZONE_AND_ACCOUNT_SUBSCRIPTION_FACTORY.md", "docs/RELEASE_763_INFRASTRUCTURE_AS_CODE_MODULE_REGISTRY.md", "docs/RELEASE_764_SERVER_AND_WORKLOAD_MODERNISATION_ASSESSMENT.md", "docs/RELEASE_765_HYBRID_CONNECTIVITY_AND_NETWORK_AUTOMATION.md", "docs/RELEASE_766_COMPUTE_CLUSTER_AND_VIRTUALISATION_OPERATIONS.md", "docs/RELEASE_767_STORAGE_DATA_PROTECTION_AND_RECOVERY.md", "docs/RELEASE_768_CLOUD_SECURITY_POSTURE_AND_CONFIGURATION_DRIFT.md", "docs/RELEASE_769_INFRASTRUCTURE_CHANGE_AND_MIGRATION_ORCHESTRATION.md", "docs/RELEASE_770_HYBRID_CLOUD_AND_INFRASTRUCTURE_ASSURANCE_GATE.md", "schemas/release-761.schema.json", "schemas/release-762.schema.json", "schemas/release-763.schema.json", "schemas/release-764.schema.json", "schemas/release-765.schema.json", "schemas/release-766.schema.json", "schemas/release-767.schema.json", "schemas/release-768.schema.json", "schemas/release-769.schema.json", "schemas/release-770.schema.json"];

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
