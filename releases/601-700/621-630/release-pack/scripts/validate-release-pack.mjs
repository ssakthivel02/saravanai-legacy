import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "openapi/releases-621-630.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/AI_RUNTIME_EVALUATION_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_621_ENTERPRISE_SOURCE_AND_COLLECTION_REGISTRY.md", "docs/RELEASE_622_INGESTION_PARSING_AND_NORMALISATION_PIPELINE.md", "docs/RELEASE_623_CHUNKING_EMBEDDING_AND_INDEX_GOVERNANCE.md", "docs/RELEASE_624_RETRIEVAL_ACCESS_FILTER_ENFORCEMENT.md", "docs/RELEASE_625_HYBRID_SEARCH_AND_RANKING_EVALUATION.md", "docs/RELEASE_626_CITATION_EVIDENCE_AND_SOURCE_TRACEABILITY.md", "docs/RELEASE_627_KNOWLEDGE_FRESHNESS_AND_EXPIRY_OPERATIONS.md", "docs/RELEASE_628_KNOWLEDGE_CONFLICT_AND_CANONICAL_RESOLUTION.md", "docs/RELEASE_629_KNOWLEDGE_FEEDBACK_AND_CORRECTION_WORKFLOW.md", "docs/RELEASE_630_ENTERPRISE_RETRIEVAL_ASSURANCE_GATE.md", "schemas/release-621.schema.json", "schemas/release-622.schema.json", "schemas/release-623.schema.json", "schemas/release-624.schema.json", "schemas/release-625.schema.json", "schemas/release-626.schema.json", "schemas/release-627.schema.json", "schemas/release-628.schema.json", "schemas/release-629.schema.json", "schemas/release-630.schema.json"];

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
