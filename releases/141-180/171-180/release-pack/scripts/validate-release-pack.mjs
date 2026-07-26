import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
const root=new URL("..",import.meta.url).pathname;
const required=["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-171-180.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_171_OPEN_STANDARDS_AND_INTEROPERABILITY.md", "docs/RELEASE_172_DATA_EXPORT_AND_PORTABILITY_OPERATIONS.md", "docs/RELEASE_173_API_SDK_AND_COMMUNITY_GOVERNANCE.md", "docs/RELEASE_174_PLUGIN_VERIFICATION_AND_TRUST_READINESS.md", "docs/RELEASE_175_RESEARCH_AND_INNOVATION_SANDBOX.md", "docs/RELEASE_176_EXPERIMENTATION_AND_FEATURE_EVALUATION.md", "docs/RELEASE_177_ROADMAP_DEPRECATION_AND_LIFECYCLE_GOVERNANCE.md", "docs/RELEASE_178_INTELLECTUAL_PROPERTY_AND_LICENSING_GOVERNANCE.md", "docs/RELEASE_179_SUSTAINABILITY_ACCESSIBILITY_AND_COMMUNITY_IMPACT.md", "docs/RELEASE_180_ENTERPRISE_SCALE_AND_ECOSYSTEM_COMPLETION_GATE.md"];
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
