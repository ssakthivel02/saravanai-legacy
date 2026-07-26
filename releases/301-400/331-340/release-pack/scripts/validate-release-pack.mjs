import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-331-340.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_331_PLATFORM_API_PRODUCT_CATALOGUE.md", "docs/RELEASE_332_GITOPS_ENVIRONMENT_PROMOTION.md", "docs/RELEASE_333_INFRASTRUCTURE_MODULE_REGISTRY.md", "docs/RELEASE_334_POLICY_AS_CODE_DISTRIBUTION.md", "docs/RELEASE_335_DEVELOPER_PORTAL_AND_SERVICE_CATALOGUE.md", "docs/RELEASE_336_GOLDEN_PATH_COMPLIANCE_SCORING.md", "docs/RELEASE_337_BUILD_REPRODUCIBILITY_AND_PROVENANCE.md", "docs/RELEASE_338_EPHEMERAL_ENVIRONMENT_GOVERNANCE.md", "docs/RELEASE_339_PLATFORM_EXPERIENCE_AND_ADOPTION_ANALYTICS.md", "docs/RELEASE_340_PLATFORM_ENGINEERING_ASSURANCE_GATE.md", "schemas/release-331.schema.json", "schemas/release-332.schema.json", "schemas/release-333.schema.json", "schemas/release-334.schema.json", "schemas/release-335.schema.json", "schemas/release-336.schema.json", "schemas/release-337.schema.json", "schemas/release-338.schema.json", "schemas/release-339.schema.json", "schemas/release-340.schema.json"];

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
