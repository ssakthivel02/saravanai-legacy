import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-181-190.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_181_AI_RUNTIME_CONTROL_PLANE.md", "docs/RELEASE_182_PROMPT_AND_POLICY_LIFECYCLE.md", "docs/RELEASE_183_MODEL_EVALUATION_AND_BENCHMARK_REGISTRY.md", "docs/RELEASE_184_RETRIEVAL_AND_CORPUS_OPERATIONS.md", "docs/RELEASE_185_AGENT_MEMORY_OPERATIONS.md", "docs/RELEASE_186_TOOL_AND_CONNECTOR_RUNTIME_GOVERNANCE.md", "docs/RELEASE_187_AI_SAFETY_INCIDENT_AND_ABUSE_INVESTIGATION.md", "docs/RELEASE_188_AI_COST_AND_PERFORMANCE_OPTIMISATION.md", "docs/RELEASE_189_AI_CHANGE_AND_ROLLBACK_MANAGEMENT.md", "docs/RELEASE_190_AI_PRODUCTION_INTELLIGENCE_ASSURANCE_GATE.md", "schemas/release-181.schema.json", "schemas/release-182.schema.json", "schemas/release-183.schema.json", "schemas/release-184.schema.json", "schemas/release-185.schema.json", "schemas/release-186.schema.json", "schemas/release-187.schema.json", "schemas/release-188.schema.json", "schemas/release-189.schema.json", "schemas/release-190.schema.json"];

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
