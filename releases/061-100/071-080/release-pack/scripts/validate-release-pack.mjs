import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/control-catalogue.json", "openapi/releases-071-080.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/SECURITY_REVIEW_TEMPLATE.md", "src/release071/model.ts", "src/release071/policy.ts", "docs/RELEASE_071_CONNECTOR_MARKETPLACE_GOVERNANCE.md", "migrations/0071_connector_marketplace_governance.sql", "src/release072/model.ts", "src/release072/policy.ts", "docs/RELEASE_072_BUSINESS_PROCESS_ORCHESTRATION.md", "migrations/0072_business_process_orchestration.sql", "src/release073/model.ts", "src/release073/policy.ts", "docs/RELEASE_073_CUSTOMER_SUPPORT_OPERATIONS.md", "migrations/0073_customer_support_operations.sql", "src/release074/model.ts", "src/release074/policy.ts", "docs/RELEASE_074_SECURE_COMMUNICATIONS_HUB.md", "migrations/0074_secure_communications_hub.sql", "src/release075/model.ts", "src/release075/policy.ts", "docs/RELEASE_075_KNOWLEDGE_PUBLISHING_AND_EDITORIAL_WORKFLOW.md", "migrations/0075_knowledge_publishing_and_editorial_workflow.sql", "src/release076/model.ts", "src/release076/policy.ts", "docs/RELEASE_076_LEARNING_AND_SKILLS_PLATFORM.md", "migrations/0076_learning_and_skills_platform.sql", "src/release077/model.ts", "src/release077/policy.ts", "docs/RELEASE_077_ANALYTICS_AND_EXECUTIVE_INSIGHTS.md", "migrations/0077_analytics_and_executive_insights.sql", "src/release078/model.ts", "src/release078/policy.ts", "docs/RELEASE_078_DATA_PRODUCTS_AND_CONTRACTS.md", "migrations/0078_data_products_and_contracts.sql", "src/release079/model.ts", "src/release079/policy.ts", "docs/RELEASE_079_PARTNER_AND_SUPPLIER_RISK.md", "migrations/0079_partner_and_supplier_risk.sql", "src/release080/model.ts", "src/release080/policy.ts", "docs/RELEASE_080_ECOSYSTEM_READINESS_GATE.md", "migrations/0080_ecosystem_readiness_gate.sql"];

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

console.log(`Release pack 071-080 validation passed: ${files.length} files`);
