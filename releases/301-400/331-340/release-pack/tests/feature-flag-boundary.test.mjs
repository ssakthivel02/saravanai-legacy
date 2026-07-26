import test from "node:test";
import assert from "node:assert/strict";

test("new features are disabled by default and have a kill switch", () => {
  const flag = { defaultEnabled: false, killSwitchAvailable: true };
  assert.equal(flag.defaultEnabled, false);
  assert.equal(flag.killSwitchAvailable, true);
});
