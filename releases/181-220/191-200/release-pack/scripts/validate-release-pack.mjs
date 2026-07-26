import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-191-200.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_191_ENTERPRISE_DATA_MESH_GOVERNANCE.md", "docs/RELEASE_192_MASTER_AND_REFERENCE_DATA_MANAGEMENT.md", "docs/RELEASE_193_EVENT_STREAMING_AND_SCHEMA_REGISTRY.md", "docs/RELEASE_194_ENTERPRISE_INTEGRATION_ORCHESTRATION.md", "docs/RELEASE_195_DATA_QUALITY_OBSERVABILITY.md", "docs/RELEASE_196_PRIVACY_PRESERVING_ANALYTICS.md", "docs/RELEASE_197_SECURE_DATA_SHARING_AND_CLEAN_ROOM_READINESS.md", "docs/RELEASE_198_RECORDS_DISCOVERY_AND_EDISCOVERY_READINESS.md", "docs/RELEASE_199_DATA_PRODUCT_LIFECYCLE_AND_CONTRACTING.md", "docs/RELEASE_200_DATA_AND_INTEGRATION_ASSURANCE_GATE.md", "schemas/release-191.schema.json", "schemas/release-192.schema.json", "schemas/release-193.schema.json", "schemas/release-194.schema.json", "schemas/release-195.schema.json", "schemas/release-196.schema.json", "schemas/release-197.schema.json", "schemas/release-198.schema.json", "schemas/release-199.schema.json", "schemas/release-200.schema.json"];

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
