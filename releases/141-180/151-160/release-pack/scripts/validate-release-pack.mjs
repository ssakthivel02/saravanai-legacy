import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
const root=new URL("..",import.meta.url).pathname;
const required=["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-151-160.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_151_PRODUCT_CATALOGUE_AND_ENTITLEMENTS.md", "docs/RELEASE_152_SERVICE_PLANS_QUOTAS_AND_FAIR_USE.md", "docs/RELEASE_153_CONTRACTS_SLA_AND_OBLIGATION_MANAGEMENT.md", "docs/RELEASE_154_CUSTOMER_ONBOARDING_AND_SUCCESS.md", "docs/RELEASE_155_SUPPORT_CASE_AND_ESCALATION_MANAGEMENT.md", "docs/RELEASE_156_SERVICE_REQUEST_AUTOMATION.md", "docs/RELEASE_157_USAGE_METERING_AND_COST_TRANSPARENCY.md", "docs/RELEASE_158_SUPPLIER_AND_PARTNER_COMMERCIAL_GOVERNANCE.md", "docs/RELEASE_159_BILLING_READINESS_WITHOUT_ACTIVATION.md", "docs/RELEASE_160_CUSTOMER_SERVICE_ASSURANCE_GATE.md"];
async function exists(p){try{return (await stat(join(root,p))).isFile();}catch{return false;}}
for(const p of required) if(!await exists(p)) throw new Error(`Missing required file: ${p}`);
async function walk(d){const o=[];for(const e of await readdir(d,{withFileTypes:true})){const p=join(d,e.name);e.isDirectory()?o.push(...await walk(p)):o.push(p);}return o;}
const files=await walk(root);
const forbidden=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/ghp_[A-Za-z0-9]{30,}/,/sk-[A-Za-z0-9]{20,}/];
for(const f of files){const text=await readFile(f,"utf8").catch(()=>null);if(text===null)continue;const self=f.endsWith("redaction.ts")||f.endsWith("validate-release-pack.mjs");for(const p of forbidden)if(!self&&p.test(text))throw new Error(`Secret-shaped content in ${relative(root,f)}`);}
const migrations=files.filter(f=>f.includes("/migrations/")&&f.endsWith(".sql")).length;
const docs=files.filter(f=>f.includes("/docs/")&&f.endsWith(".md")).length;
if(migrations!==10)throw new Error(`Expected 10 migrations, found ${migrations}`);
if(docs!==10)throw new Error(`Expected 10 release docs, found ${docs}`);
console.log(`Release pack validation passed: ${files.length} files`);
