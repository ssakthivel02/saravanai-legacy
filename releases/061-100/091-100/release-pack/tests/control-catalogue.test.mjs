import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const catalogue = JSON.parse(await readFile(new URL("../policies/control-catalogue.json", import.meta.url), "utf8"));
test("control identifiers are unique and evidence-ready", () => {
  const ids = catalogue.controls.map(control => control.controlId);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(catalogue.controls.every(control => Array.isArray(control.evidenceIds)), true);
});
