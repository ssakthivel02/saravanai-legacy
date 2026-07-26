import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-291-300.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "evidence/GO_NO_GO_TEMPLATE.md", "docs/RELEASE_291_GLOBAL_TENANT_AND_REGIONAL_OPERATIONS.md", "docs/RELEASE_292_PLATFORM_MARKETPLACE_AND_PLUGIN_OPERATIONS.md", "docs/RELEASE_293_DEVELOPER_ECOSYSTEM_AND_API_PROGRAMME.md", "docs/RELEASE_294_DATA_MODEL_AND_CONFIGURATION_PORTABILITY.md", "docs/RELEASE_295_RELEASE_TRAIN_AND_PORTFOLIO_ORCHESTRATION.md", "docs/RELEASE_296_CUSTOMER_MIGRATION_AND_UPGRADE_FACTORY.md", "docs/RELEASE_297_GLOBAL_SUPPORT_AND_FOLLOW_THE_SUN_OPERATIONS.md", "docs/RELEASE_298_PERFORMANCE_SCALE_AND_COST_CERTIFICATION_READINESS.md", "docs/RELEASE_299_ENTERPRISE_GENERAL_AVAILABILITY_READINESS_BOARD.md", "docs/RELEASE_300_SAKTHIAI_ENTERPRISE_PROGRAMME_COMPLETION_GATE_V2.md", "schemas/release-291.schema.json", "schemas/release-292.schema.json", "schemas/release-293.schema.json", "schemas/release-294.schema.json", "schemas/release-295.schema.json", "schemas/release-296.schema.json", "schemas/release-297.schema.json", "schemas/release-298.schema.json", "schemas/release-299.schema.json", "schemas/release-300.schema.json"];

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
