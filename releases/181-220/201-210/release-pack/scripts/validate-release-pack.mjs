import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-201-210.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_201_GEOPOLITICAL_AND_REGIONAL_RISK_INTELLIGENCE.md", "docs/RELEASE_202_CRISIS_INFORMATION_INTEGRITY.md", "docs/RELEASE_203_VULNERABILITY_AND_PATCH_GOVERNANCE.md", "docs/RELEASE_204_SOFTWARE_SUPPLY_CHAIN_PROVENANCE.md", "docs/RELEASE_205_IDENTITY_THREAT_DETECTION_AND_RESPONSE.md", "docs/RELEASE_206_PRIVILEGED_AND_INSIDER_RISK_CONTROLS.md", "docs/RELEASE_207_FRAUD_ACCOUNT_ABUSE_AND_MISUSE_PREVENTION.md", "docs/RELEASE_208_CYBER_RECOVERY_AND_RESILIENCE_OPERATIONS.md", "docs/RELEASE_209_TRANSPARENCY_REPORTING_AND_REDRESS.md", "docs/RELEASE_210_GLOBAL_TRUST_AND_RESILIENCE_ASSURANCE_GATE.md", "schemas/release-201.schema.json", "schemas/release-202.schema.json", "schemas/release-203.schema.json", "schemas/release-204.schema.json", "schemas/release-205.schema.json", "schemas/release-206.schema.json", "schemas/release-207.schema.json", "schemas/release-208.schema.json", "schemas/release-209.schema.json", "schemas/release-210.schema.json"];

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

const migrations = files.filter(file => file.includes("/migrations/") && file.endsWith(".sql")).length;
const docs = files.filter(file => file.includes("/docs/") && file.endsWith(".md")).length;
const schemas = files.filter(file => file.includes("/schemas/") && file.endsWith(".json")).length;

if (migrations !== 10) throw new Error(`Expected 10 migrations, found ${migrations}`);
if (docs !== 10) throw new Error(`Expected 10 release documents, found ${docs}`);
if (schemas !== 10) throw new Error(`Expected 10 schemas, found ${schemas}`);

console.log(`Release pack validation passed: ${files.length} files`);
