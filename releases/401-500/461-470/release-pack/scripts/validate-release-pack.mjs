import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-461-470.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_461_SUSTAINABILITY_DATA_AND_METHODOLOGY_REGISTRY.md", "docs/RELEASE_462_CARBON_AWARE_WORKLOAD_SCHEDULING_V2.md", "docs/RELEASE_463_ENERGY_EFFICIENCY_ENGINEERING.md", "docs/RELEASE_464_HARDWARE_LIFECYCLE_AND_CIRCULARITY.md", "docs/RELEASE_465_ENVIRONMENTAL_RISK_AND_DEPENDENCY_ASSESSMENT.md", "docs/RELEASE_466_WORKER_WELLBEING_AND_RESPONSIBLE_AUTOMATION.md", "docs/RELEASE_467_COMMUNITY_AND_PUBLIC_INTEREST_IMPACT.md", "docs/RELEASE_468_RESPONSIBLE_INNOVATION_REVIEW_BOARD.md", "docs/RELEASE_469_SUSTAINABILITY_CLAIMS_AND_DISCLOSURE.md", "docs/RELEASE_470_SUSTAINABILITY_AND_SOCIAL_IMPACT_GATE.md", "schemas/release-461.schema.json", "schemas/release-462.schema.json", "schemas/release-463.schema.json", "schemas/release-464.schema.json", "schemas/release-465.schema.json", "schemas/release-466.schema.json", "schemas/release-467.schema.json", "schemas/release-468.schema.json", "schemas/release-469.schema.json", "schemas/release-470.schema.json"];

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
