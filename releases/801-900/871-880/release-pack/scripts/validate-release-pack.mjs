import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/runtime-activation.json", "policies/release-gates.json", "openapi/releases-871-880.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/WORKER_MIDDLEWARE_ORDER.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "implementation/IMPLEMENTATION_BACKLOG.md", "implementation/WORKER_WIRING_GUIDE.md", "implementation/D1_MIGRATION_PLAN.md", "implementation/OPERATIONAL_ACCEPTANCE.md", "evidence/IMPLEMENTATION_READINESS_TEMPLATE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_871_DIGITAL_TWIN_ASSET_AND_MODEL_REGISTRY.md", "docs/RELEASE_872_SIMULATION_SCENARIO_AND_ASSUMPTION_CONTRACT.md", "docs/RELEASE_873_SYNTHETIC_DATA_AND_PRIVACY_BOUNDARY.md", "docs/RELEASE_874_SIMULATION_EXECUTION_SANDBOX_RUNTIME.md", "docs/RELEASE_875_SCENARIO_COMPARISON_AND_SENSITIVITY_ANALYSIS.md", "docs/RELEASE_876_OPERATIONAL_FORECAST_AND_CAPACITY_SIMULATION.md", "docs/RELEASE_877_RESILIENCE_FAILURE_AND_RECOVERY_SIMULATION.md", "docs/RELEASE_878_HUMAN_DECISION_AND_SIMULATION_REVIEW_BOARD.md", "docs/RELEASE_879_SIMULATION_MODEL_DRIFT_AND_RECALIBRATION.md", "docs/RELEASE_880_DIGITAL_TWIN_AND_SIMULATION_ACTIVATION_GATE.md", "schemas/release-871.schema.json", "schemas/release-872.schema.json", "schemas/release-873.schema.json", "schemas/release-874.schema.json", "schemas/release-875.schema.json", "schemas/release-876.schema.json", "schemas/release-877.schema.json", "schemas/release-878.schema.json", "schemas/release-879.schema.json", "schemas/release-880.schema.json"];

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
    if (!selfTest && pattern.test(text)) throw new Error(`Secret-shaped content in ${relative(root,file)}`);
  }
}

const counts = {
  migrations: files.filter(file => file.includes("/migrations/") && file.endsWith(".sql")).length,
  documents: files.filter(file => file.includes("/docs/") && file.endsWith(".md")).length,
  schemas: files.filter(file => file.includes("/schemas/") && file.endsWith(".json")).length,
  releaseContracts: files.filter(file => /\/release\d+\/contracts\.ts$/.test(file)).length,
  releasePolicies: files.filter(file => /\/release\d+\/policy\.ts$/.test(file)).length,
  releaseServices: files.filter(file => /\/release\d+\/service\.ts$/.test(file)).length,
  releaseRoutes: files.filter(file => /\/release\d+\/route\.ts$/.test(file)).length,
  releaseIntegrations: files.filter(file => /\/release\d+\/integration\.ts$/.test(file)).length,
  releaseTelemetry: files.filter(file => /\/release\d+\/telemetry\.ts$/.test(file)).length
};

for (const [name,count] of Object.entries(counts)) {
  if (count !== 10) throw new Error(`Expected 10 ${name}, found ${count}`);
}

console.log(`Release pack validation passed: ${files.length} files`);
