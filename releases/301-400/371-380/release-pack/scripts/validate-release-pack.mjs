import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-371-380.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_371_GLOBAL_SRE_CONTROL_PLANE.md", "docs/RELEASE_372_REGIONAL_ACTIVE_ACTIVE_READINESS.md", "docs/RELEASE_373_DEPENDENCY_FAILURE_AND_BULKHEAD_ENGINEERING.md", "docs/RELEASE_374_CHAOS_EXPERIMENT_GOVERNANCE_V2.md", "docs/RELEASE_375_BACKUP_IMMUTABILITY_AND_CYBER_VAULT.md", "docs/RELEASE_376_CRISIS_COMMAND_AND_STAKEHOLDER_COMMUNICATIONS.md", "docs/RELEASE_377_SUPPLY_CHAIN_CONTINUITY_AND_ALTERNATIVE_SOURCING.md", "docs/RELEASE_378_CLIMATE_AND_EXTREME_WEATHER_RESILIENCE.md", "docs/RELEASE_379_SUSTAINABILITY_AND_CAPACITY_TRADE_OFF_GOVERNANCE.md", "docs/RELEASE_380_GLOBAL_RESILIENCE_ASSURANCE_GATE.md", "schemas/release-371.schema.json", "schemas/release-372.schema.json", "schemas/release-373.schema.json", "schemas/release-374.schema.json", "schemas/release-375.schema.json", "schemas/release-376.schema.json", "schemas/release-377.schema.json", "schemas/release-378.schema.json", "schemas/release-379.schema.json", "schemas/release-380.schema.json"];

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
