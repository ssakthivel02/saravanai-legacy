import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-381-390.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_381_KNOWLEDGE_GRAPH_QUALITY_V2.md", "docs/RELEASE_382_CITATION_AND_EVIDENCE_INTEGRITY_V2.md", "docs/RELEASE_383_MULTILINGUAL_TERMINOLOGY_AND_TRANSLATION_OPERATIONS_V2.md", "docs/RELEASE_384_ACCESSIBLE_CONTENT_AND_ASSISTIVE_TECHNOLOGY_TESTING.md", "docs/RELEASE_385_CHILD_SAFE_LEARNING_AND_FAMILY_CONTROLS_V2.md", "docs/RELEASE_386_CULTURAL_RELIGIOUS_AND_INDIGENOUS_KNOWLEDGE_REVIEW.md", "docs/RELEASE_387_SYNTHETIC_MEDIA_PROVENANCE_AND_WATERMARK_READINESS.md", "docs/RELEASE_388_PUBLIC_INFORMATION_CORRECTION_AND_TRANSPARENCY.md", "docs/RELEASE_389_EDITORIAL_INDEPENDENCE_AND_CONFLICT_DISCLOSURE.md", "docs/RELEASE_390_KNOWLEDGE_TRUST_ASSURANCE_GATE.md", "schemas/release-381.schema.json", "schemas/release-382.schema.json", "schemas/release-383.schema.json", "schemas/release-384.schema.json", "schemas/release-385.schema.json", "schemas/release-386.schema.json", "schemas/release-387.schema.json", "schemas/release-388.schema.json", "schemas/release-389.schema.json", "schemas/release-390.schema.json"];

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
