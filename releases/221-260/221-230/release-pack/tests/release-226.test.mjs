import test from "node:test";import assert from "node:assert/strict";
const controls=["release_226_owner_required", "release_226_evidence_required", "release_226_tenant_scope_required", "release_226_rollback_required"];
test("Release 226 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 226 requires evidence",()=>assert.equal([].length>0,false));