import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/decision-integrity.json", "openapi/releases-571-580.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/DECISION_RECORD_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "runbooks/DECISION_APPEAL.md", "docs/RELEASE_571_COST_MODEL_AND_UNIT_ECONOMICS_REGISTRY.md", "docs/RELEASE_572_BUDGET_PLANNING_AND_SCENARIO_ANALYSIS.md", "docs/RELEASE_573_FINOPS_ALLOCATION_AND_SHOWBACK_V2.md", "docs/RELEASE_574_INVESTMENT_PORTFOLIO_PRIORITISATION.md", "docs/RELEASE_575_BENEFITS_REALISATION_AND_OUTCOME_VERIFICATION.md", "docs/RELEASE_576_VENDOR_COST_AND_CONTRACT_OPTIMISATION.md", "docs/RELEASE_577_CONSUMPTION_QUOTA_AND_ENTITLEMENT_PLANNING.md", "docs/RELEASE_578_ECONOMIC_RISK_AND_SENSITIVITY_TESTING.md", "docs/RELEASE_579_VALUE_TRANSPARENCY_AND_EXECUTIVE_REPORTING.md", "docs/RELEASE_580_ENTERPRISE_ECONOMICS_ASSURANCE_GATE.md", "schemas/release-571.schema.json", "schemas/release-572.schema.json", "schemas/release-573.schema.json", "schemas/release-574.schema.json", "schemas/release-575.schema.json", "schemas/release-576.schema.json", "schemas/release-577.schema.json", "schemas/release-578.schema.json", "schemas/release-579.schema.json", "schemas/release-580.schema.json"];

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
