import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "policies/runtime-boundary.json", "openapi/releases-641-650.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "architecture/SECURITY_ARCHITECTURE.md", "architecture/PRIVACY_ARCHITECTURE.md", "architecture/RESILIENCE_ARCHITECTURE.md", "evidence/GO_NO_GO_TEMPLATE.md", "evidence/AI_RUNTIME_EVALUATION_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_641_MULTIMODAL_PROJECT_AND_ASSET_WORKSPACE.md", "docs/RELEASE_642_IMAGE_PROMPT_AND_EDIT_SPECIFICATION.md", "docs/RELEASE_643_AUDIO_AND_VOICE_PRODUCTION_PIPELINE.md", "docs/RELEASE_644_VIDEO_STORYBOARD_AND_GENERATION_PIPELINE.md", "docs/RELEASE_645_DOCUMENT_PRESENTATION_AND_PDF_COMPOSER.md", "docs/RELEASE_646_MEDIA_QUALITY_AND_BRAND_COMPLIANCE.md", "docs/RELEASE_647_CONTENT_MODERATION_AND_SENSITIVE_CONTEXT_REVIEW.md", "docs/RELEASE_648_MEDIA_PROVENANCE_PACKAGING_AND_VERIFICATION.md", "docs/RELEASE_649_CONTENT_DISTRIBUTION_AND_WITHDRAWAL.md", "docs/RELEASE_650_MULTIMODAL_CONTENT_OPERATIONS_GATE.md", "schemas/release-641.schema.json", "schemas/release-642.schema.json", "schemas/release-643.schema.json", "schemas/release-644.schema.json", "schemas/release-645.schema.json", "schemas/release-646.schema.json", "schemas/release-647.schema.json", "schemas/release-648.schema.json", "schemas/release-649.schema.json", "schemas/release-650.schema.json"];

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
