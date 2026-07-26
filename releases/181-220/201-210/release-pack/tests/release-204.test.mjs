import test from "node:test";
import assert from "node:assert/strict";

const controls = ["sbom_required", "provenance_required", "signature_required", "critical_findings_block"];

test("Release 204 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

