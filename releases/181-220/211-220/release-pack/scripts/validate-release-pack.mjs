import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-211-220.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_211_ENTERPRISE_STRATEGY_AND_OBJECTIVES.md", "docs/RELEASE_212_ARCHITECTURE_PORTFOLIO_AND_TECHNOLOGY_RADAR.md", "docs/RELEASE_213_SCENARIO_INTELLIGENCE_AND_FORECASTING.md", "docs/RELEASE_214_BOARD_DECISION_AND_ACCOUNTABILITY_RECORDS.md", "docs/RELEASE_215_INNOVATION_PORTFOLIO_GOVERNANCE.md", "docs/RELEASE_216_WORKFORCE_AND_SKILLS_INTELLIGENCE.md", "docs/RELEASE_217_TECHNOLOGY_AND_SUPPLIER_EVALUATION.md", "docs/RELEASE_218_CAPACITY_SUSTAINABILITY_AND_DEMAND_PLANNING.md", "docs/RELEASE_219_ARCHIVE_EXIT_AND_LONG_TERM_PRESERVATION.md", "docs/RELEASE_220_ENTERPRISE_INTELLIGENCE_COMPLETION_GATE.md", "schemas/release-211.schema.json", "schemas/release-212.schema.json", "schemas/release-213.schema.json", "schemas/release-214.schema.json", "schemas/release-215.schema.json", "schemas/release-216.schema.json", "schemas/release-217.schema.json", "schemas/release-218.schema.json", "schemas/release-219.schema.json", "schemas/release-220.schema.json"];

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
