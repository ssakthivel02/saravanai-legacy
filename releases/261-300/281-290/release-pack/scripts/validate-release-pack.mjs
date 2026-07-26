import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-281-290.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "evidence/GO_NO_GO_TEMPLATE.md", "docs/RELEASE_281_ENTERPRISE_CONTROL_LIBRARY.md", "docs/RELEASE_282_AUTOMATED_EVIDENCE_COLLECTION.md", "docs/RELEASE_283_AUDIT_PLANNING_AND_FIELDWORK.md", "docs/RELEASE_284_REGULATORY_OBLIGATION_MANAGEMENT.md", "docs/RELEASE_285_PRIVACY_OPERATIONS_AND_RIGHTS_AUTOMATION.md", "docs/RELEASE_286_MODEL_RISK_MANAGEMENT.md", "docs/RELEASE_287_THIRD_PARTY_ASSURANCE_AND_MONITORING.md", "docs/RELEASE_288_BUSINESS_CONTINUITY_AND_CRISIS_EXERCISES.md", "docs/RELEASE_289_EXECUTIVE_RISK_AND_COMPLIANCE_REPORTING.md", "docs/RELEASE_290_TRUST_AND_COMPLIANCE_ASSURANCE_GATE.md", "schemas/release-281.schema.json", "schemas/release-282.schema.json", "schemas/release-283.schema.json", "schemas/release-284.schema.json", "schemas/release-285.schema.json", "schemas/release-286.schema.json", "schemas/release-287.schema.json", "schemas/release-288.schema.json", "schemas/release-289.schema.json", "schemas/release-290.schema.json"];

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
  schemas: files.filter(file => file.includes("/schemas/") && file.endsWith(".json")).length
};

if (counts.migrations !== 10) throw new Error(`Expected 10 migrations, found ${counts.migrations}`);
if (counts.documents !== 10) throw new Error(`Expected 10 documents, found ${counts.documents}`);
if (counts.schemas !== 10) throw new Error(`Expected 10 schemas, found ${counts.schemas}`);

console.log(`Release pack validation passed: ${files.length} files`);
