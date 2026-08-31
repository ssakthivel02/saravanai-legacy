import test from "node:test";import assert from "node:assert/strict";
const allowed=(u,a)=>{const h=new URL(u).hostname;return a.some(x=>h===x||h.endsWith(`.${x}`));};
test("egress allowlist enforced",()=>{assert.equal(allowed("https://api.github.com/repos",["github.com"]),true);assert.equal(allowed("https://example.invalid",["github.com"]),false);});
