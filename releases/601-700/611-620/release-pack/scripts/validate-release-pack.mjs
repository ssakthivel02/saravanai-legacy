import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "openapi/releases-611-620.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/AI_RUNTIME_EVALUATION_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_611_AGENT_RUNTIME_IDENTITY_AND_SESSION.md", "docs/RELEASE_612_AGENT_PLAN_VALIDATION_AND_POLICY_COMPILATION.md", "docs/RELEASE_613_TOOL_CATALOGUE_AND_CAPABILITY_MANIFEST.md", "docs/RELEASE_614_TOOL_INVOCATION_GATEWAY.md", "docs/RELEASE_615_AGENT_SANDBOX_AND_RESOURCE_ISOLATION.md", "docs/RELEASE_616_AGENT_MEMORY_SCOPE_AND_EXPIRY.md", "docs/RELEASE_617_MULTI_AGENT_COORDINATION_PROTOCOL_V2.md", "docs/RELEASE_618_AGENT_FAILURE_RECOVERY_AND_COMPENSATION.md", "docs/RELEASE_619_AGENT_BEHAVIOUR_AND_DRIFT_MONITORING.md", "docs/RELEASE_620_SECURE_AGENT_RUNTIME_ASSURANCE_GATE.md", "schemas/release-611.schema.json", "schemas/release-612.schema.json", "schemas/release-613.schema.json", "schemas/release-614.schema.json", "schemas/release-615.schema.json", "schemas/release-616.schema.json", "schemas/release-617.schema.json", "schemas/release-618.schema.json", "schemas/release-619.schema.json", "schemas/release-620.schema.json"];

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
  releaseRoutes: files.filter(file => /\/release\d+\/route\.ts$/.test(file)).length
};

for (const [name,count] of Object.entries(counts)) {
  if (count !== 10) throw new Error(`Expected 10 ${name}, found ${count}`);
}

console.log(`Release pack validation passed: ${files.length} files`);
