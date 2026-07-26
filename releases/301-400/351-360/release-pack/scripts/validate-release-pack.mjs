import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-351-360.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_351_ENTERPRISE_CUSTOMER_WORKSPACE_V2.md", "docs/RELEASE_352_PARTNER_AND_RESELLER_WORKSPACE.md", "docs/RELEASE_353_MARKETPLACE_PUBLISHER_ONBOARDING.md", "docs/RELEASE_354_CAPABILITY_SUBSCRIPTION_AND_ENTITLEMENT_READINESS.md", "docs/RELEASE_355_CUSTOMER_HEALTH_AND_ADOPTION_INTELLIGENCE.md", "docs/RELEASE_356_SERVICE_REVIEW_AND_SUCCESS_PLANNING.md", "docs/RELEASE_357_COMPLAINT_REDRESS_AND_OMBUDSMAN_READINESS.md", "docs/RELEASE_358_PARTNER_PERFORMANCE_AND_RISK_MONITORING.md", "docs/RELEASE_359_ECOSYSTEM_COMMERCIAL_READINESS_WITHOUT_BILLING.md", "docs/RELEASE_360_CUSTOMER_AND_PARTNER_ASSURANCE_GATE.md", "schemas/release-351.schema.json", "schemas/release-352.schema.json", "schemas/release-353.schema.json", "schemas/release-354.schema.json", "schemas/release-355.schema.json", "schemas/release-356.schema.json", "schemas/release-357.schema.json", "schemas/release-358.schema.json", "schemas/release-359.schema.json", "schemas/release-360.schema.json"];

async function exists(path) {
  try {
    return (await stat(join(root, path))).isFile();
  } catch {
    return false;
  }
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
  const selfTest =
    file.endsWith("redaction.ts") ||
    file.endsWith("validate-release-pack.mjs");

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
