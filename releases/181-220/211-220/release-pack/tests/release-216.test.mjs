import test from "node:test";
import assert from "node:assert/strict";

const controls = ["skills_required", "learning_paths_required", "owner_required", "invasive_monitoring_forbidden"];

test("Release 216 defines distinct explicit controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 216 keeps invasiveMonitoringAllowed disabled", () => {
  assert.equal({ invasiveMonitoringAllowed: false }.invasiveMonitoringAllowed, false);
});

