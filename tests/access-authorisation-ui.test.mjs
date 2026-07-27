import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveAuthorisationView } from '../assets/access-authorisation.js';

test('UI reports prepared and disabled state without claiming production enforcement', () => {
  const view = deriveAuthorisationView({
    authorisation: {
      endpointAuthorisationEnabled: false,
      serverMutationsEnabled: false,
      catalogue: { routeCount: 17, ownerOnlyRouteCount: 6, defaultDecision: 'deny-unclassified-when-enabled' },
      auditContract: { persistenceEnabled: false }
    },
    currentSession: { role: 'local-owner', cryptographicallyVerified: false }
  });
  assert.equal(view.title, 'Endpoint authorisation is prepared');
  assert.equal(view.metrics.serverMutations, 'Disabled');
  assert.equal(view.metrics.audit, 'Metadata contract only');
});

test('UI distinguishes active verified enforcement', () => {
  const view = deriveAuthorisationView({
    authorisation: {
      endpointAuthorisationEnabled: true,
      serverMutationsEnabled: false,
      catalogue: { routeCount: 17, ownerOnlyRouteCount: 6 },
      auditContract: { persistenceEnabled: false }
    },
    currentSession: { role: 'owner', cryptographicallyVerified: true }
  });
  assert.equal(view.title, 'Endpoint authorisation is active');
  assert.match(view.summary, /verified owner/i);
});
