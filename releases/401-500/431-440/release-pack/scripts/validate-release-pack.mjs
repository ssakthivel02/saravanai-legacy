import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-431-440.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_431_ENTERPRISE_LAKEHOUSE_DOMAIN_REGISTRY.md", "docs/RELEASE_432_DATA_INGESTION_AND_CHANGE_DATA_CAPTURE.md", "docs/RELEASE_433_BATCH_AND_STREAM_PROCESSING_GOVERNANCE.md", "docs/RELEASE_434_DATA_QUALITY_RULES_AND_OBSERVABILITY_V2.md", "docs/RELEASE_435_DATA_LINEAGE_AND_IMPACT_ANALYSIS_V2.md", "docs/RELEASE_436_DATA_ACCESS_PRODUCTISATION.md", "docs/RELEASE_437_DATA_RETENTION_ARCHIVAL_AND_LEGAL_HOLD.md", "docs/RELEASE_438_DATA_PLATFORM_COST_AND_CAPACITY.md", "docs/RELEASE_439_DATA_PLATFORM_RECOVERY_AND_PORTABILITY.md", "docs/RELEASE_440_GOVERNED_DATA_PLATFORM_ASSURANCE_GATE.md", "schemas/release-431.schema.json", "schemas/release-432.schema.json", "schemas/release-433.schema.json", "schemas/release-434.schema.json", "schemas/release-435.schema.json", "schemas/release-436.schema.json", "schemas/release-437.schema.json", "schemas/release-438.schema.json", "schemas/release-439.schema.json", "schemas/release-440.schema.json"];

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
