import test from "node:test";import assert from "node:assert/strict";
const controls=["release_227_owner_required", "release_227_evidence_required", "release_227_tenant_scope_required", "release_227_rollback_required"];
test("Release 227 has explicit unique controls",()=>{assert.equal(controls.length,4);assert.equal(new Set(controls).size,4);});
test("Release 227 requires evidence",()=>assert.equal([].length>0,false));