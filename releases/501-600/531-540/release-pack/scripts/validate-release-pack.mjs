import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/decision-integrity.json", "openapi/releases-531-540.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/DECISION_RECORD_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "runbooks/DECISION_APPEAL.md", "docs/RELEASE_531_CYBER_RECOVERY_SERVICE_CATALOGUE.md", "docs/RELEASE_532_RANSOMWARE_CONTAINMENT_AND_RECOVERY.md", "docs/RELEASE_533_IMMUTABLE_BACKUP_VERIFICATION_V2.md", "docs/RELEASE_534_IDENTITY_RECOVERY_AND_BREAK_GLASS_OPERATIONS.md", "docs/RELEASE_535_CLOUD_CONTROL_PLANE_RECOVERY.md", "docs/RELEASE_536_DATA_INTEGRITY_AND_RECONCILIATION_RECOVERY.md", "docs/RELEASE_537_APPLICATION_REBUILD_FACTORY.md", "docs/RELEASE_538_CYBER_CRISIS_EXERCISE_AND_LESSONS.md", "docs/RELEASE_539_RECOVERY_METRICS_AND_EXECUTIVE_REPORTING.md", "docs/RELEASE_540_CYBER_RESILIENCE_ASSURANCE_GATE.md", "schemas/release-531.schema.json", "schemas/release-532.schema.json", "schemas/release-533.schema.json", "schemas/release-534.schema.json", "schemas/release-535.schema.json", "schemas/release-536.schema.json", "schemas/release-537.schema.json", "schemas/release-538.schema.json", "schemas/release-539.schema.json", "schemas/release-540.schema.json"];

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
