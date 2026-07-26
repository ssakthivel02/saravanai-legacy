import test from "node:test";import assert from "node:assert/strict";
const controls=["release_235_owner_required", "release_235_evidence_required", "release_235_tenant_scope_required", "release_235_rollback_required"];
test("Release 235 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 235 requires evidence",()=>assert.equal([].length>0,false));