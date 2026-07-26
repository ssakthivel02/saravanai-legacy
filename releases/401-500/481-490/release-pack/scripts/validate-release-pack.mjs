import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-481-490.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_481_GLOBAL_PRIVACY_JURISDICTION_REGISTRY.md", "docs/RELEASE_482_CROSS_BORDER_DATA_TRANSFER_GOVERNANCE.md", "docs/RELEASE_483_CONSENT_AND_LAWFUL_BASIS_OPERATIONS_V2.md", "docs/RELEASE_484_DIGITAL_IDENTITY_TRUST_FRAMEWORK.md", "docs/RELEASE_485_ELECTRONIC_SIGNATURE_AND_EVIDENCE_READINESS.md", "docs/RELEASE_486_RECORDS_MANAGEMENT_AND_DEFENSIBLE_DISPOSAL.md", "docs/RELEASE_487_AI_REGULATORY_READINESS_REGISTER.md", "docs/RELEASE_488_DIGITAL_TRUST_TRANSPARENCY_REPORTING.md", "docs/RELEASE_489_INDEPENDENT_AUDIT_AND_ATTESTATION_READINESS.md", "docs/RELEASE_490_GLOBAL_DIGITAL_TRUST_ASSURANCE_GATE.md", "schemas/release-481.schema.json", "schemas/release-482.schema.json", "schemas/release-483.schema.json", "schemas/release-484.schema.json", "schemas/release-485.schema.json", "schemas/release-486.schema.json", "schemas/release-487.schema.json", "schemas/release-488.schema.json", "schemas/release-489.schema.json", "schemas/release-490.schema.json"];

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
