import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "policies/research-integrity.json", "openapi/releases-791-800.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/EVALUATION_CAMPAIGN_TEMPLATE.md", "evidence/RESEARCH_QUALITY_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_791_ENTERPRISE_PLATFORM_V7_CAPABILITY_CATALOGUE.md", "docs/RELEASE_792_PRODUCTION_ARCHITECTURE_REVIEW_V7.md", "docs/RELEASE_793_ENVIRONMENT_CONFIGURATION_AND_SECRET_READINESS.md", "docs/RELEASE_794_PRODUCTION_DATA_AND_MIGRATION_READINESS_V5.md", "docs/RELEASE_795_OPERATIONAL_SUPPORT_AND_SERVICE_TRANSITION_V5.md", "docs/RELEASE_796_GLOBAL_ROLLOUT_AND_REGIONAL_READINESS_V3.md", "docs/RELEASE_797_CUSTOMER_PILOT_AND_ADOPTION_EVIDENCE_V2.md", "docs/RELEASE_798_COMMERCIAL_SERVICE_DEFINITION_WITHOUT_BILLING_V3.md", "docs/RELEASE_799_ENTERPRISE_PLATFORM_V7_GENERAL_AVAILABILITY_BOARD.md", "docs/RELEASE_800_SAKTHIAI_ENTERPRISE_PLATFORM_V7_COMPLETION_GATE.md", "schemas/release-791.schema.json", "schemas/release-792.schema.json", "schemas/release-793.schema.json", "schemas/release-794.schema.json", "schemas/release-795.schema.json", "schemas/release-796.schema.json", "schemas/release-797.schema.json", "schemas/release-798.schema.json", "schemas/release-799.schema.json", "schemas/release-800.schema.json"];

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
