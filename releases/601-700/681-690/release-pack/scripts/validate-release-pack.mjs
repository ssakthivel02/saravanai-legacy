import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "openapi/releases-681-690.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/AI_RUNTIME_EVALUATION_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_681_OBLIGATION_AND_CONTROL_REQUIREMENT_REGISTRY.md", "docs/RELEASE_682_CONTROL_DESIGN_AND_TEST_CATALOGUE_V2.md", "docs/RELEASE_683_CONTINUOUS_CONTROL_EVIDENCE_COLLECTION.md", "docs/RELEASE_684_CONTROL_EFFECTIVENESS_ASSESSMENT.md", "docs/RELEASE_685_ISSUE_FINDING_AND_REMEDIATION_MANAGEMENT.md", "docs/RELEASE_686_POLICY_EXCEPTION_AND_RISK_ACCEPTANCE_V2.md", "docs/RELEASE_687_AUDIT_REQUEST_AND_EVIDENCE_WORKSPACE.md", "docs/RELEASE_688_MANAGEMENT_ASSERTION_AND_DISCLOSURE_CONTROL.md", "docs/RELEASE_689_INDEPENDENT_ASSURANCE_READINESS_V2.md", "docs/RELEASE_690_COMPLIANCE_AND_ASSURANCE_GATE.md", "schemas/release-681.schema.json", "schemas/release-682.schema.json", "schemas/release-683.schema.json", "schemas/release-684.schema.json", "schemas/release-685.schema.json", "schemas/release-686.schema.json", "schemas/release-687.schema.json", "schemas/release-688.schema.json", "schemas/release-689.schema.json", "schemas/release-690.schema.json"];

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
