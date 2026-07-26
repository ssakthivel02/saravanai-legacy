import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "openapi/releases-691-700.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/AI_RUNTIME_EVALUATION_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_691_ENTERPRISE_PLATFORM_V6_CAPABILITY_CATALOGUE.md", "docs/RELEASE_692_PRODUCTION_ARCHITECTURE_AND_SECURITY_REVIEW_V6.md", "docs/RELEASE_693_TENANT_ONBOARDING_AND_CONFIGURATION_FACTORY_V2.md", "docs/RELEASE_694_PRODUCTION_MIGRATION_AND_CUTOVER_CONTROL_V4.md", "docs/RELEASE_695_GLOBAL_OPERATIONS_AND_FOLLOW_THE_SUN_READINESS.md", "docs/RELEASE_696_SERVICE_CONTINUITY_AND_PROVIDER_EXIT_V4.md", "docs/RELEASE_697_CUSTOMER_ACCEPTANCE_AND_PILOT_EVIDENCE.md", "docs/RELEASE_698_COMMERCIAL_ENTITLEMENT_READINESS_WITHOUT_BILLING_V2.md", "docs/RELEASE_699_ENTERPRISE_PLATFORM_V6_GENERAL_AVAILABILITY_BOARD.md", "docs/RELEASE_700_SAKTHIAI_ENTERPRISE_PLATFORM_V6_COMPLETION_GATE.md", "schemas/release-691.schema.json", "schemas/release-692.schema.json", "schemas/release-693.schema.json", "schemas/release-694.schema.json", "schemas/release-695.schema.json", "schemas/release-696.schema.json", "schemas/release-697.schema.json", "schemas/release-698.schema.json", "schemas/release-699.schema.json", "schemas/release-700.schema.json"];

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
  releaseRoutes: files.filter(file => /\/release\d+\/route\.ts$/.test(file)).length
};

for (const [name,count] of Object.entries(counts)) {
  if (count !== 10) throw new Error(`Expected 10 ${name}, found ${count}`);
}

console.log(`Release pack validation passed: ${files.length} files`);
