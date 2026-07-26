import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-271-280.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "evidence/GO_NO_GO_TEMPLATE.md", "docs/RELEASE_271_ENTERPRISE_KNOWLEDGE_PUBLISHING.md", "docs/RELEASE_272_CONTENT_LIFECYCLE_AND_EDITORIAL_GOVERNANCE.md", "docs/RELEASE_273_MULTIMODAL_CONTENT_GENERATION_SAFETY.md", "docs/RELEASE_274_TRANSLATION_TRANSLITERATION_AND_TERMINOLOGY.md", "docs/RELEASE_275_SEARCH_DISCOVERY_AND_RECOMMENDATION_GOVERNANCE.md", "docs/RELEASE_276_LEARNING_ASSESSMENT_AND_CREDENTIAL_READINESS.md", "docs/RELEASE_277_CHILDREN_AND_FAMILY_EXPERIENCE_SAFETY.md", "docs/RELEASE_278_RELIGIOUS_CULTURAL_AND_HERITAGE_INTEGRITY.md", "docs/RELEASE_279_PUBLIC_KNOWLEDGE_TRANSPARENCY_AND_CORRECTIONS.md", "docs/RELEASE_280_KNOWLEDGE_AND_EXPERIENCE_ASSURANCE_GATE.md", "schemas/release-271.schema.json", "schemas/release-272.schema.json", "schemas/release-273.schema.json", "schemas/release-274.schema.json", "schemas/release-275.schema.json", "schemas/release-276.schema.json", "schemas/release-277.schema.json", "schemas/release-278.schema.json", "schemas/release-279.schema.json", "schemas/release-280.schema.json"];

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
    if (!selfTest && pattern.test(text)) {
      throw new Error(`Secret-shaped content in ${relative(root, file)}`);
    }
  }
}

const counts = {
  migrations: files.filter(file => file.includes("/migrations/") && file.endsWith(".sql")).length,
  documents: files.filter(file => file.includes("/docs/") && file.endsWith(".md")).length,
  schemas: files.filter(file => file.includes("/schemas/") && file.endsWith(".json")).length
};

if (counts.migrations !== 10) throw new Error(`Expected 10 migrations, found ${counts.migrations}`);
if (counts.documents !== 10) throw new Error(`Expected 10 documents, found ${counts.documents}`);
if (counts.schemas !== 10) throw new Error(`Expected 10 schemas, found ${counts.schemas}`);

console.log(`Release pack validation passed: ${files.length} files`);
