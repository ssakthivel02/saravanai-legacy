import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-411-420.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_411_SOVEREIGN_AI_DEPLOYMENT_PROFILE.md", "docs/RELEASE_412_OFFLINE_AND_DISCONNECTED_AI_RUNTIME.md", "docs/RELEASE_413_EDGE_MODEL_PACKAGING_AND_VERIFICATION.md", "docs/RELEASE_414_DEVICE_AI_POLICY_AND_POSTURE.md", "docs/RELEASE_415_LOCAL_RETRIEVAL_AND_KNOWLEDGE_SYNCHRONISATION.md", "docs/RELEASE_416_CONSTRAINED_COMPUTE_OPTIMISATION.md", "docs/RELEASE_417_OFFLINE_UPDATE_AND_PATCH_GOVERNANCE.md", "docs/RELEASE_418_EDGE_AI_PRIVACY_AND_SENSOR_MINIMISATION.md", "docs/RELEASE_419_SOVEREIGN_OPERATIONS_AND_SUPPORT_READINESS.md", "docs/RELEASE_420_SOVEREIGN_AND_EDGE_AI_ASSURANCE_GATE.md", "schemas/release-411.schema.json", "schemas/release-412.schema.json", "schemas/release-413.schema.json", "schemas/release-414.schema.json", "schemas/release-415.schema.json", "schemas/release-416.schema.json", "schemas/release-417.schema.json", "schemas/release-418.schema.json", "schemas/release-419.schema.json", "schemas/release-420.schema.json"];

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
