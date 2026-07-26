import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/decision-integrity.json", "openapi/releases-541-550.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/DECISION_RECORD_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "runbooks/DECISION_APPEAL.md", "docs/RELEASE_541_IDENTITY_PROOFING_AND_ASSURANCE.md", "docs/RELEASE_542_CREDENTIAL_ISSUANCE_AND_LIFECYCLE.md", "docs/RELEASE_543_PASSWORDLESS_AND_PASSKEY_READINESS.md", "docs/RELEASE_544_VERIFIABLE_CREDENTIAL_READINESS.md", "docs/RELEASE_545_DELEGATED_GUARDIAN_AND_REPRESENTATIVE_ACCESS.md", "docs/RELEASE_546_PRIVILEGED_IDENTITY_GOVERNANCE_V2.md", "docs/RELEASE_547_IDENTITY_RECOVERY_FRAUD_AND_REDRESS.md", "docs/RELEASE_548_FEDERATION_AND_TRUST_BROKER_OPERATIONS.md", "docs/RELEASE_549_IDENTITY_PRIVACY_AND_SELECTIVE_DISCLOSURE.md", "docs/RELEASE_550_IDENTITY_TRUST_ASSURANCE_GATE.md", "schemas/release-541.schema.json", "schemas/release-542.schema.json", "schemas/release-543.schema.json", "schemas/release-544.schema.json", "schemas/release-545.schema.json", "schemas/release-546.schema.json", "schemas/release-547.schema.json", "schemas/release-548.schema.json", "schemas/release-549.schema.json", "schemas/release-550.schema.json"];

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
