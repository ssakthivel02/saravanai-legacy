import test from 'node:test';
import assert from 'node:assert/strict';
import { build019LifecycleContract, handleBuild019PlatformApi, OWNER_BUILD_019, PLATFORM_RELEASE_019 } from '../src/platform-release-019.js';

test('Build 019 identifiers are current', () => {
  assert.equal(PLATFORM_RELEASE_019, '0.19.0-tenant-lifecycle-assurance');
  assert.equal(OWNER_BUILD_019, 19);
});

test('lifecycle contract is safe and disabled by default', () => {
  const contract = build019LifecycleContract({});
  assert.equal(contract.recovery.operational, false);
  assert.equal(contract.recovery.emergencyStopped, true);
  assert.equal(contract.restore.productionRestoreAllowed, false);
  assert.equal(contract.deletion.hardDeleteImplemented, false);
});

test('lifecycle endpoint exposes no identity or tenant material', async () => {
  const request = new Request('https://example.test/api/v1/platform/storage/lifecycle', {
    headers: {
      'x-sakthiai-access-email': 'owner@example.com',
      'x-sakthiai-profile-key': 'profile-0123456789abcdef01234567',
      'cf-access-jwt-assertion': 'secret.jwt.value'
    }
  });
  const response = await handleBuild019PlatformApi(request, {}, new URL(request.url));
  const payload = await response.json();
  assert.equal(payload.platformRelease, PLATFORM_RELEASE_019);
  assert.equal(payload.boundaries.migrationExecuted, false);
  const serialised = JSON.stringify(payload);
  assert.equal(serialised.includes('owner@example.com'), false);
  assert.equal(serialised.includes('secret.jwt.value'), false);
  assert.equal(serialised.includes('0123456789abcdef'), false);
});
