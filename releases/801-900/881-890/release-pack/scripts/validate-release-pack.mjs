import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/runtime-activation.json", "policies/release-gates.json", "openapi/releases-881-890.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/WORKER_MIDDLEWARE_ORDER.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "implementation/IMPLEMENTATION_BACKLOG.md", "implementation/WORKER_WIRING_GUIDE.md", "implementation/D1_MIGRATION_PLAN.md", "implementation/OPERATIONAL_ACCEPTANCE.md", "evidence/IMPLEMENTATION_READINESS_TEMPLATE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_881_PLATFORM_UNIT_ECONOMICS_AND_COST_MODEL.md", "docs/RELEASE_882_TENANT_QUOTA_AND_FAIR_USE_RUNTIME.md", "docs/RELEASE_883_CAPACITY_FORECAST_AND_ADMISSION_PLANNING.md", "docs/RELEASE_884_CLOUD_RESOURCE_SCHEDULING_AND_RIGHTSIZING.md", "docs/RELEASE_885_FINOPS_ALLOCATION_AND_SHOWBACK_WITHOUT_BILLING.md", "docs/RELEASE_886_ENERGY_CARBON_AND_SUSTAINABILITY_MEASUREMENT.md", "docs/RELEASE_887_PERFORMANCE_EFFICIENCY_AND_COST_REGRESSION.md", "docs/RELEASE_888_PROVIDER_CONTRACT_EXIT_AND_PORTABILITY_READINESS.md", "docs/RELEASE_889_ECONOMIC_STRESS_TEST_AND_HARD_STOP_EXERCISE.md", "docs/RELEASE_890_ECONOMICS_CAPACITY_AND_SUSTAINABILITY_GATE.md", "schemas/release-881.schema.json", "schemas/release-882.schema.json", "schemas/release-883.schema.json", "schemas/release-884.schema.json", "schemas/release-885.schema.json", "schemas/release-886.schema.json", "schemas/release-887.schema.json", "schemas/release-888.schema.json", "schemas/release-889.schema.json", "schemas/release-890.schema.json"];

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
