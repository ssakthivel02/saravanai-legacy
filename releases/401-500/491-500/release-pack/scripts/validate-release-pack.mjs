import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-491-500.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_491_ENTERPRISE_PLATFORM_V4_SERVICE_CATALOGUE.md", "docs/RELEASE_492_PRODUCTION_READINESS_REVIEW_V4.md", "docs/RELEASE_493_OPERATIONAL_ACCEPTANCE_AND_SERVICE_TRANSITION_V2.md", "docs/RELEASE_494_GLOBAL_LAUNCH_AND_REGIONAL_ROLLOUT.md", "docs/RELEASE_495_CUSTOMER_MIGRATION_FACTORY_V2.md", "docs/RELEASE_496_ENTERPRISE_SUPPORT_AND_ESCALATION_MODEL_V2.md", "docs/RELEASE_497_COMMERCIAL_AND_ENTITLEMENT_READINESS_WITHOUT_BILLING.md", "docs/RELEASE_498_PROVIDER_EXIT_AND_BUSINESS_CONTINUITY_V2.md", "docs/RELEASE_499_ENTERPRISE_PLATFORM_V4_GENERAL_AVAILABILITY_BOARD.md", "docs/RELEASE_500_SAKTHIAI_ENTERPRISE_PLATFORM_V4_COMPLETION_GATE.md", "schemas/release-491.schema.json", "schemas/release-492.schema.json", "schemas/release-493.schema.json", "schemas/release-494.schema.json", "schemas/release-495.schema.json", "schemas/release-496.schema.json", "schemas/release-497.schema.json", "schemas/release-498.schema.json", "schemas/release-499.schema.json", "schemas/release-500.schema.json"];

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
    if (!selfTest && pattern.test(text)) {
      throw new Error(`Secret-shaped content in ${relative(root, file)}`);
    }
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

for (const [name, count] of Object.entries(counts)) {
  if (count !== 10) throw new Error(`Expected 10 ${name}, found ${count}`);
}

console.log(`Release pack validation passed: ${files.length} files`);
