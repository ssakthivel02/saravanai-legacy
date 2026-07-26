import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-471-480.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_471_ENGINEERING_WORK_ITEM_INTELLIGENCE.md", "docs/RELEASE_472_CODE_REVIEW_QUALITY_AND_POLICY.md", "docs/RELEASE_473_TEST_INTELLIGENCE_AND_COVERAGE_RISK.md", "docs/RELEASE_474_CI_PIPELINE_RELIABILITY_ENGINEERING.md", "docs/RELEASE_475_DEVELOPER_ENVIRONMENT_AND_TOOLCHAIN_GOVERNANCE.md", "docs/RELEASE_476_ENGINEERING_KNOWLEDGE_AND_DECISION_RECORDS.md", "docs/RELEASE_477_SECURE_CODING_ASSISTANT_GOVERNANCE.md", "docs/RELEASE_478_TECHNICAL_DEBT_AND_REFACTORING_INTELLIGENCE.md", "docs/RELEASE_479_ENGINEERING_PRODUCTIVITY_AND_FAIR_MEASUREMENT.md", "docs/RELEASE_480_ENGINEERING_INTELLIGENCE_ASSURANCE_GATE.md", "schemas/release-471.schema.json", "schemas/release-472.schema.json", "schemas/release-473.schema.json", "schemas/release-474.schema.json", "schemas/release-475.schema.json", "schemas/release-476.schema.json", "schemas/release-477.schema.json", "schemas/release-478.schema.json", "schemas/release-479.schema.json", "schemas/release-480.schema.json"];

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
