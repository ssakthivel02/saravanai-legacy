import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
const root=new URL("..",import.meta.url).pathname;
const required=["src/index.ts", "policies/safety-defaults.json", "policies/release-gates.json", "openapi/releases-141-150.yaml", "evidence/GO_NO_GO_TEMPLATE.md", "architecture/TRUST_BOUNDARIES.md", "docs/RELEASE_141_UNIFIED_ENTERPRISE_WORKSPACE.md", "docs/RELEASE_142_CONVERSATIONAL_EXPERIENCE_AND_CONTEXT.md", "docs/RELEASE_143_PREFERENCE_AND_PERSONALISATION_GOVERNANCE.md", "docs/RELEASE_144_ACCESSIBILITY_INTELLIGENCE.md", "docs/RELEASE_145_MULTILINGUAL_AND_LOCALISATION_OPERATIONS.md", "docs/RELEASE_146_NOTIFICATION_AND_ATTENTION_GOVERNANCE.md", "docs/RELEASE_147_SECURE_COLLABORATION_AND_KNOWLEDGE_WORK.md", "docs/RELEASE_148_EXECUTIVE_AND_OPERATIONAL_DASHBOARDS.md", "docs/RELEASE_149_DIGITAL_ADOPTION_AND_LEARNING_OPERATIONS.md", "docs/RELEASE_150_EXPERIENCE_ASSURANCE_GATE.md"];
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
