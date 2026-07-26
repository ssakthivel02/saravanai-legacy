import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/decision-integrity.json", "openapi/releases-561-570.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/DECISION_RECORD_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "runbooks/DECISION_APPEAL.md", "docs/RELEASE_561_EMERGENCY_INFORMATION_VERIFICATION.md", "docs/RELEASE_562_CRISIS_ALERTING_AND_NOTIFICATION.md", "docs/RELEASE_563_DISASTER_RESPONSE_RESOURCE_COORDINATION.md", "docs/RELEASE_564_HUMANITARIAN_DATA_PROTECTION.md", "docs/RELEASE_565_MISSING_PERSON_AND_FAMILY_REUNIFICATION_SAFETY.md", "docs/RELEASE_566_PUBLIC_HEALTH_INFORMATION_BOUNDARY.md", "docs/RELEASE_567_ESSENTIAL_SERVICE_CONTINUITY.md", "docs/RELEASE_568_VOLUNTEER_AND_COMMUNITY_COORDINATION.md", "docs/RELEASE_569_PUBLIC_EVENT_AND_CROWD_SAFETY_INFORMATION.md", "docs/RELEASE_570_PUBLIC_SAFETY_AND_HUMANITARIAN_ASSURANCE_GATE.md", "schemas/release-561.schema.json", "schemas/release-562.schema.json", "schemas/release-563.schema.json", "schemas/release-564.schema.json", "schemas/release-565.schema.json", "schemas/release-566.schema.json", "schemas/release-567.schema.json", "schemas/release-568.schema.json", "schemas/release-569.schema.json", "schemas/release-570.schema.json"];

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
