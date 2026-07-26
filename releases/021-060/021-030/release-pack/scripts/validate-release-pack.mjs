import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const required = [
  "src/release021/identity.ts",
  "src/release022/zero-trust.ts",
  "src/release023/ai-safety.ts",
  "src/release024/agents.ts",
  "src/release025/knowledge-graph.ts",
  "src/release026/memory.ts",
  "src/release027/telemetry.ts",
  "policies/release-policy.json",
  "ui/workspace/index.html",
  "evidence/GO_NO_GO_TEMPLATE.md",
  "openapi/releases-021-030.yaml"
];

async function exists(path) {
  try { return (await stat(join(root, path))).isFile(); } catch { return false; }
}

for (const path of required) {
  if (!await exists(path)) throw new Error(`Missing required file: ${path}`);
}

async function walk(dir) {
  const out=[];
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const p=join(dir,entry.name);
    if(entry.isDirectory()) out.push(...await walk(p)); else out.push(p);
  }
  return out;
}

const files=await walk(root);
const forbidden=[
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /ghp_[A-Za-z0-9]{30,}/,
  /sk-[A-Za-z0-9]{20,}/
];
for(const file of files){
  const text=await readFile(file,"utf8").catch(()=>null);
  if(text===null) continue;
  for(const pattern of forbidden){
    if(pattern.test(text) && !file.endsWith("ai-safety.ts") && !file.endsWith("validate-release-pack.mjs")){
      throw new Error(`Secret-shaped content in ${relative(root,file)}`);
    }
  }
}
console.log(`Release pack validation passed: ${files.length} files`);
