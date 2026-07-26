import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/control-catalogue.json", "openapi/releases-091-100.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/SECURITY_REVIEW_TEMPLATE.md", "src/release091/model.ts", "src/release091/policy.ts", "docs/RELEASE_091_GOVERNED_AGENT_MESH.md", "migrations/0091_governed_agent_mesh.sql", "src/release092/model.ts", "src/release092/policy.ts", "docs/RELEASE_092_SELF_HEALING_OPERATIONS.md", "migrations/0092_self_healing_operations.sql", "src/release093/model.ts", "src/release093/policy.ts", "docs/RELEASE_093_AUTONOMOUS_TESTING_AND_VERIFICATION.md", "migrations/0093_autonomous_testing_and_verification.sql", "src/release094/model.ts", "src/release094/policy.ts", "docs/RELEASE_094_PROGRESSIVE_DELIVERY_AND_RELEASE_ENGINEERING.md", "migrations/0094_progressive_delivery_and_release_engineering.sql", "src/release095/model.ts", "src/release095/policy.ts", "docs/RELEASE_095_DIGITAL_TWIN_AND_ENVIRONMENT_SIMULATION.md", "migrations/0095_digital_twin_and_environment_simulation.sql", "src/release096/model.ts", "src/release096/policy.ts", "docs/RELEASE_096_CAPACITY_AND_PERFORMANCE_ENGINEERING.md", "migrations/0096_capacity_and_performance_engineering.sql", "src/release097/model.ts", "src/release097/policy.ts", "docs/RELEASE_097_SUSTAINABILITY_AND_CARBON_AWARE_COMPUTING.md", "migrations/0097_sustainability_and_carbon_aware_computing.sql", "src/release098/model.ts", "src/release098/policy.ts", "docs/RELEASE_098_ENTERPRISE_CONTINUITY_AND_EXIT_STRATEGY.md", "migrations/0098_enterprise_continuity_and_exit_strategy.sql", "src/release099/model.ts", "src/release099/policy.ts", "docs/RELEASE_099_PRODUCTION_EVIDENCE_AND_CERTIFICATION_READINESS.md", "migrations/0099_production_evidence_and_certification_readiness.sql", "src/release100/model.ts", "src/release100/policy.ts", "docs/RELEASE_100_SAKTHIAI_ENTERPRISE_EDITION_V1_0_LAUNCH_GATE.md", "migrations/0100_sakthiai_enterprise_edition_v1_0_launch_gate.sql"];

async function exists(path) {
  try { return (await stat(join(root, path))).isFile(); }
  catch { return false; }
}

for (const path of required) {
  if (!await exists(path)) throw new Error(`Missing required file: ${path}`);
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(path)); else out.push(path);
  }
  return out;
}

const files = await walk(root);
const forbiddenNames = [".env", "id_rsa", "credentials.json", "service-account.json"];
for (const file of files) {
  const lower = file.toLowerCase();
  if (forbiddenNames.some(name => lower.endsWith(name))) throw new Error(`Forbidden credential file: ${relative(root, file)}`);
  const text = await readFile(file, "utf8").catch(() => null);
  if (text === null) continue;
  if (text.includes("BEGIN " + "PRIVATE KEY")) throw new Error(`Private key material in ${relative(root, file)}`);
}

console.log(`Release pack 091-100 validation passed: ${files.length} files`);
