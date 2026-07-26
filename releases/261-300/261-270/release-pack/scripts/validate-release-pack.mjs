import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-261-270.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "evidence/GO_NO_GO_TEMPLATE.md", "docs/RELEASE_261_ENTERPRISE_PROCESS_CATALOGUE.md", "docs/RELEASE_262_WORKFLOW_DEFINITION_AND_VERSIONING.md", "docs/RELEASE_263_DECISION_TABLES_AND_RULES_MANAGEMENT.md", "docs/RELEASE_264_HUMAN_TASK_AND_APPROVAL_ORCHESTRATION.md", "docs/RELEASE_265_DOCUMENT_DRIVEN_PROCESS_AUTOMATION.md", "docs/RELEASE_266_COMMUNICATION_AUTOMATION_GOVERNANCE.md", "docs/RELEASE_267_ROBOTIC_PROCESS_AUTOMATION_SAFETY.md", "docs/RELEASE_268_PROCESS_MINING_AND_CONFORMANCE.md", "docs/RELEASE_269_AUTOMATION_VALUE_AND_PERFORMANCE.md", "docs/RELEASE_270_ENTERPRISE_AUTOMATION_ASSURANCE_GATE.md", "schemas/release-261.schema.json", "schemas/release-262.schema.json", "schemas/release-263.schema.json", "schemas/release-264.schema.json", "schemas/release-265.schema.json", "schemas/release-266.schema.json", "schemas/release-267.schema.json", "schemas/release-268.schema.json", "schemas/release-269.schema.json", "schemas/release-270.schema.json"];

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
