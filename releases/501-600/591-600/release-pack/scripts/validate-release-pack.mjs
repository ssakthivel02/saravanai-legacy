import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/decision-integrity.json", "openapi/releases-591-600.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/DECISION_RECORD_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "runbooks/DECISION_APPEAL.md", "docs/RELEASE_591_SERVICE_MANAGEMENT_OPERATING_MODEL_V3.md", "docs/RELEASE_592_ENTERPRISE_ARCHITECTURE_REPOSITORY_V3.md", "docs/RELEASE_593_CONTINUOUS_CONTROL_MONITORING_V2.md", "docs/RELEASE_594_PRODUCT_AND_PLATFORM_ROADMAP_GOVERNANCE_V2.md", "docs/RELEASE_595_MIGRATION_AND_DECOMMISSION_FACTORY_V3.md", "docs/RELEASE_596_SUPPORT_TRAINING_AND_CERTIFICATION_READINESS.md", "docs/RELEASE_597_PRODUCTION_CHANGE_AND_RELEASE_CONTROL_V3.md", "docs/RELEASE_598_ENTERPRISE_EXIT_AND_DATA_PORTABILITY_V3.md", "docs/RELEASE_599_ENTERPRISE_PLATFORM_V5_GENERAL_AVAILABILITY_BOARD.md", "docs/RELEASE_600_SAKTHIAI_ENTERPRISE_PLATFORM_V5_COMPLETION_GATE.md", "schemas/release-591.schema.json", "schemas/release-592.schema.json", "schemas/release-593.schema.json", "schemas/release-594.schema.json", "schemas/release-595.schema.json", "schemas/release-596.schema.json", "schemas/release-597.schema.json", "schemas/release-598.schema.json", "schemas/release-599.schema.json", "schemas/release-600.schema.json"];

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
  releaseServices: files.filter(file => /\/release\d+\/service\.ts$/.test(file)).length
};

for (const [name,count] of Object.entries(counts)) {
  if (count !== 10) throw new Error(`Expected 10 ${name}, found ${count}`);
}

console.log(`Release pack validation passed: ${files.length} files`);
