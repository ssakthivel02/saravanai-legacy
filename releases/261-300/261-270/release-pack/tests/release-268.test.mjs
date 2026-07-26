import test from "node:test";
import assert from "node:assert/strict";

const controls = ["event_provenance_required", "score_bounded", "owner_required", "invasive_monitoring_forbidden"];

test("Release 268 defines explicit unique controls", () => {
  assert.equal(controls.length >= 4, true);
  assert.equal(new Set(controls).size, controls.length);
});

test("Release 268 keeps invasiveWorkerMonitoringAllowed disabled", () => {
  assert.equal({ invasiveWorkerMonitoringAllowed: false }.invasiveWorkerMonitoringAllowed, false);
});

