import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-301-310.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_301_ENTERPRISE_DIGITAL_TWIN_REGISTRY.md", "docs/RELEASE_302_ENVIRONMENT_AND_INFRASTRUCTURE_TWIN.md", "docs/RELEASE_303_BUSINESS_PROCESS_TWIN.md", "docs/RELEASE_304_CUSTOMER_JOURNEY_TWIN.md", "docs/RELEASE_305_DATA_AND_KNOWLEDGE_TWIN.md", "docs/RELEASE_306_THREAT_AND_ATTACK_SIMULATION.md", "docs/RELEASE_307_CAPACITY_AND_COST_SIMULATION.md", "docs/RELEASE_308_CHANGE_IMPACT_SIMULATION.md", "docs/RELEASE_309_RECOVERY_AND_CONTINUITY_SIMULATION.md", "docs/RELEASE_310_DIGITAL_TWIN_ASSURANCE_GATE.md", "schemas/release-301.schema.json", "schemas/release-302.schema.json", "schemas/release-303.schema.json", "schemas/release-304.schema.json", "schemas/release-305.schema.json", "schemas/release-306.schema.json", "schemas/release-307.schema.json", "schemas/release-308.schema.json", "schemas/release-309.schema.json", "schemas/release-310.schema.json"];

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
