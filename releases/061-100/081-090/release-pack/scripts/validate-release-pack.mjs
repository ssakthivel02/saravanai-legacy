import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/control-catalogue.json", "openapi/releases-081-090.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/SECURITY_REVIEW_TEMPLATE.md", "src/release081/model.ts", "src/release081/policy.ts", "docs/RELEASE_081_GLOBAL_PRIVACY_ORCHESTRATION.md", "migrations/0081_global_privacy_orchestration.sql", "src/release082/model.ts", "src/release082/policy.ts", "docs/RELEASE_082_REGIONAL_DATA_CONTROLS.md", "migrations/0082_regional_data_controls.sql", "src/release083/model.ts", "src/release083/policy.ts", "docs/RELEASE_083_CHILDREN_AND_VULNERABLE_USER_SAFETY.md", "migrations/0083_children_and_vulnerable_user_safety.sql", "src/release084/model.ts", "src/release084/policy.ts", "docs/RELEASE_084_PUBLIC_EVENT_AND_EMERGENCY_SAFETY.md", "migrations/0084_public_event_and_emergency_safety.sql", "src/release085/model.ts", "src/release085/policy.ts", "docs/RELEASE_085_TRUST_AND_TRANSPARENCY_CENTRE.md", "migrations/0085_trust_and_transparency_centre.sql", "src/release086/model.ts", "src/release086/policy.ts", "docs/RELEASE_086_AI_ETHICS_AND_IMPACT_ASSESSMENT.md", "migrations/0086_ai_ethics_and_impact_assessment.sql", "src/release087/model.ts", "src/release087/policy.ts", "docs/RELEASE_087_REGULATORY_CHANGE_MANAGEMENT.md", "migrations/0087_regulatory_change_management.sql", "src/release088/model.ts", "src/release088/policy.ts", "docs/RELEASE_088_FRAUD_ABUSE_AND_MISUSE_PREVENTION.md", "migrations/0088_fraud_abuse_and_misuse_prevention.sql", "src/release089/model.ts", "src/release089/policy.ts", "docs/RELEASE_089_SECURITY_OPERATIONS_AND_THREAT_INTELLIGENCE.md", "migrations/0089_security_operations_and_threat_intelligence.sql", "src/release090/model.ts", "src/release090/policy.ts", "docs/RELEASE_090_GLOBAL_TRUST_ASSURANCE_GATE.md", "migrations/0090_global_trust_assurance_gate.sql"];

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

console.log(`Release pack 081-090 validation passed: ${files.length} files`);
