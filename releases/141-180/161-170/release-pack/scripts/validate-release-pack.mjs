import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
const root=new URL("..",import.meta.url).pathname;
const required=["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-161-170.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_161_INTERNAL_DEVELOPER_PLATFORM.md", "docs/RELEASE_162_GOLDEN_PATHS_AND_SOFTWARE_TEMPLATES.md", "docs/RELEASE_163_ENVIRONMENT_PROVISIONING_GOVERNANCE.md", "docs/RELEASE_164_CONFIGURATION_AND_FEATURE_FLAG_GOVERNANCE.md", "docs/RELEASE_165_DATABASE_CHANGE_MANAGEMENT.md", "docs/RELEASE_166_DATA_PIPELINE_AND_DATAOPS_CONTROL_PLANE.md", "docs/RELEASE_167_AI_AND_ML_PIPELINE_ORCHESTRATION.md", "docs/RELEASE_168_TEST_DATA_AND_SYNTHETIC_DATA_MANAGEMENT.md", "docs/RELEASE_169_PLATFORM_RELIABILITY_ENGINEERING.md", "docs/RELEASE_170_PLATFORM_ENGINEERING_ASSURANCE_GATE.md"];
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
