import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/runtime-activation.json", "policies/release-gates.json", "openapi/releases-841-850.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/WORKER_MIDDLEWARE_ORDER.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/ACCESSIBILITY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "implementation/IMPLEMENTATION_BACKLOG.md", "implementation/WORKER_WIRING_GUIDE.md", "implementation/D1_MIGRATION_PLAN.md", "implementation/OPERATIONAL_ACCEPTANCE.md", "evidence/IMPLEMENTATION_READINESS_TEMPLATE.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_841_CUSTOMER_WORKSPACE_TENANT_PROVISIONING.md", "docs/RELEASE_842_WORKSPACE_ROLE_AND_DELEGATION_RUNTIME.md", "docs/RELEASE_843_PROJECT_CONVERSATION_AND_ACTIVITY_STREAM.md", "docs/RELEASE_844_DOCUMENT_ASSET_AND_VERSION_WORKSPACE.md", "docs/RELEASE_845_TASK_REVIEW_AND_APPROVAL_BOARD.md", "docs/RELEASE_846_NOTIFICATION_PREFERENCE_AND_DELIVERY_RUNTIME.md", "docs/RELEASE_847_CUSTOMER_SUPPORT_CASE_AND_SERVICE_REQUEST.md", "docs/RELEASE_848_WORKSPACE_SEARCH_AND_KNOWLEDGE_ASSISTANCE.md", "docs/RELEASE_849_WORKSPACE_EXPORT_DELETION_AND_PORTABILITY.md", "docs/RELEASE_850_CUSTOMER_WORKSPACE_ACTIVATION_GATE.md", "schemas/release-841.schema.json", "schemas/release-842.schema.json", "schemas/release-843.schema.json", "schemas/release-844.schema.json", "schemas/release-845.schema.json", "schemas/release-846.schema.json", "schemas/release-847.schema.json", "schemas/release-848.schema.json", "schemas/release-849.schema.json", "schemas/release-850.schema.json"];

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
