import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-311-320.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_311_AGENT_SPECIFICATION_AND_CAPABILITY_CONTRACTS.md", "docs/RELEASE_312_AGENT_PLANNING_AND_GOAL_GOVERNANCE.md", "docs/RELEASE_313_AGENT_TOOL_PERMISSION_COMPILER.md", "docs/RELEASE_314_AGENT_COMMUNICATION_PROTOCOLS.md", "docs/RELEASE_315_MULTI_AGENT_COORDINATION_AND_DEADLOCK_CONTROL.md", "docs/RELEASE_316_FORMAL_INVARIANT_AND_CONSTRAINT_VERIFICATION.md", "docs/RELEASE_317_AGENT_TEST_HARNESS_AND_SCENARIO_REPLAY.md", "docs/RELEASE_318_AGENT_BEHAVIOUR_DRIFT_MONITORING.md", "docs/RELEASE_319_HUMAN_OVERSIGHT_AND_OVERRIDE_OPERATIONS.md", "docs/RELEASE_320_AGENT_ENGINEERING_ASSURANCE_GATE.md", "schemas/release-311.schema.json", "schemas/release-312.schema.json", "schemas/release-313.schema.json", "schemas/release-314.schema.json", "schemas/release-315.schema.json", "schemas/release-316.schema.json", "schemas/release-317.schema.json", "schemas/release-318.schema.json", "schemas/release-319.schema.json", "schemas/release-320.schema.json"];

async function exists(path) {
  try {
    return (await stat(join(root, path))).isFile();
  } catch {
    return false;
  }
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
  const selfTest =
    file.endsWith("redaction.ts") ||
    file.endsWith("validate-release-pack.mjs");

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
