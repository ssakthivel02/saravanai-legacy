import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = ["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-321-330.yaml", "architecture/HLD.md", "architecture/LLD.md", "architecture/TRUST_BOUNDARIES.md", "architecture/NON_FUNCTIONAL_REQUIREMENTS.md", "evidence/GO_NO_GO_TEMPLATE.md", "runbooks/THREAT_MODEL.md", "runbooks/ROLLBACK.md", "docs/RELEASE_321_CRYPTOGRAPHIC_ASSET_INVENTORY.md", "docs/RELEASE_322_KEY_AND_CERTIFICATE_LIFECYCLE_AUTOMATION.md", "docs/RELEASE_323_POST_QUANTUM_CRYPTOGRAPHY_READINESS.md", "docs/RELEASE_324_CONFIDENTIAL_COMPUTING_READINESS.md", "docs/RELEASE_325_SECURE_ENCLAVE_WORKLOAD_GOVERNANCE.md", "docs/RELEASE_326_ZERO_TRUST_SERVICE_MESH.md", "docs/RELEASE_327_WORKLOAD_IDENTITY_AND_SPIFFE_READINESS.md", "docs/RELEASE_328_SECURITY_POLICY_VERIFICATION_AND_MODEL_CHECKING.md", "docs/RELEASE_329_CRYPTOGRAPHIC_INCIDENT_RESPONSE.md", "docs/RELEASE_330_CRYPTOGRAPHIC_AGILITY_ASSURANCE_GATE.md", "schemas/release-321.schema.json", "schemas/release-322.schema.json", "schemas/release-323.schema.json", "schemas/release-324.schema.json", "schemas/release-325.schema.json", "schemas/release-326.schema.json", "schemas/release-327.schema.json", "schemas/release-328.schema.json", "schemas/release-329.schema.json", "schemas/release-330.schema.json"];

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
