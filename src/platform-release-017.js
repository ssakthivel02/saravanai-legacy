import { accessAuditContractSummary } from './access-audit-contract.js';
import { accessRouteAuthorisationEnabled, accessServerMutationsEnabled } from './access-authorizer.js';
import { ACCESS_AUTHORISATION_RELEASE, accessRouteCatalogueSummary } from './access-route-catalogue.js';
import { handleOwnerApi } from './owner-api.js';

export const PLATFORM_RELEASE_017 = '0.17.0-endpoint-authorisation';
export const OWNER_BUILD_017 = 17;

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  });
}

function currentSession(request) {
  const cryptographicallyVerified = request.headers.get('x-sakthiai-access-verified') === 'true';
  const role = cryptographicallyVerified ? request.headers.get('x-sakthiai-access-role') || 'unknown' : 'local-owner';
  return {
    cryptographicallyVerified,
    role: ['owner', 'member', 'reader'].includes(role) ? role : 'local-owner',
    identityFieldsExposed: false
  };
}

export function build017AuthorisationContract(request, env = {}) {
  const endpointAuthorisationEnabled = accessRouteAuthorisationEnabled(env);
  const serverMutationsEnabled = accessServerMutationsEnabled(env);
  return {
    endpointAuthorisationRelease: ACCESS_AUTHORISATION_RELEASE,
    endpointAuthorisationEnabled,
    serverMutationsEnabled,
    defaultDenyReady: true,
    unclassifiedRouteDecision: endpointAuthorisationEnabled ? 'deny' : 'prepared-not-enforced',
    serverRoleEnforcementEnabled: endpointAuthorisationEnabled,
    serverWritesAllowed: endpointAuthorisationEnabled && serverMutationsEnabled,
    catalogue: accessRouteCatalogueSummary(),
    auditContract: accessAuditContractSummary(),
    currentSession: currentSession(request),
    nextGate: endpointAuthorisationEnabled
      ? 'Verify owner allow, member work-route allow, reader read-only denial and unknown-route default denial before enabling any server mutation.'
      : 'Complete the verified owner-only Cloudflare Access pilot before activating ACCESS_ROUTE_AUTHORIZATION_ENABLED.'
  };
}

function augmentPayload(payload, request, env, pathname) {
  const contract = build017AuthorisationContract(request, env);
  const result = {
    ...payload,
    platformRelease: PLATFORM_RELEASE_017,
    ownerBuild: OWNER_BUILD_017,
    components: { ...(payload.components || {}), endpointAuthorisation: ACCESS_AUTHORISATION_RELEASE },
    activation: {
      ...(payload.activation || {}),
      endpointAuthorisationEnabled: contract.endpointAuthorisationEnabled,
      defaultDenyReady: contract.defaultDenyReady,
      serverMutationsEnabled: contract.serverMutationsEnabled,
      serverRoleEnforcementEnabled: contract.serverRoleEnforcementEnabled,
      serverWritesAllowed: contract.serverWritesAllowed
    },
    endpointAuthorisationRelease: ACCESS_AUTHORISATION_RELEASE
  };

  if (pathname === '/api/v1/platform/capabilities') {
    result.features = {
      ...(payload.features || {}),
      identity: {
        ...(payload.features?.identity || {}),
        endpointAuthorisationPrepared: true,
        endpointAuthorisationEnabled: contract.endpointAuthorisationEnabled,
        defaultDenyReady: true,
        serverRoleEnforcementEnabled: contract.serverRoleEnforcementEnabled
      }
    };
    result.bindings = {
      ...(payload.bindings || {}),
      accessRouteAuthorisation: contract.endpointAuthorisationEnabled,
      accessServerMutations: contract.serverMutationsEnabled
    };
  }

  if (pathname === '/api/v1/platform/session') {
    result.endpointAuthorisationEnabled = contract.endpointAuthorisationEnabled;
    result.defaultDenyReady = true;
    result.serverMutationsEnabled = contract.serverMutationsEnabled;
  }

  if (pathname === '/api/v1/mobile/config') {
    result.authentication = 'Cloudflare Access JWT verification, exact-email role policy, browser profile isolation and disabled-by-default endpoint authorisation are prepared.';
    result.endpoints = { ...(payload.endpoints || {}), accessAuthorisation: '/api/v1/platform/access/authorisation' };
  }

  if (pathname === '/api/v1/platform/access/readiness') {
    result.boundaries = {
      ...(payload.boundaries || {}),
      endpointAuthorisationEnabled: contract.endpointAuthorisationEnabled,
      serverMutationsEnabled: contract.serverMutationsEnabled
    };
  }

  if (pathname === '/api/v1/platform/release') result.nextManualGate = contract.nextGate;
  return result;
}

const WRAPPED_PATHS = new Set([
  '/api/v1/platform/release',
  '/api/v1/platform/access/readiness',
  '/api/v1/platform/capabilities',
  '/api/v1/platform/session',
  '/api/v1/mobile/config'
]);

export async function handleBuild017PlatformApi(request, env, url) {
  if (request.method === 'GET' && url.pathname === '/api/v1/platform/access/authorisation') {
    const contract = build017AuthorisationContract(request, env);
    return json({
      status: 'ok',
      platformRelease: PLATFORM_RELEASE_017,
      ownerBuild: OWNER_BUILD_017,
      authorisation: contract,
      currentSession: contract.currentSession,
      boundaries: {
        fullEmailExposed: false,
        profileKeyExposed: false,
        jwtExposed: false,
        accessAudienceExposed: false,
        auditPersistenceEnabled: false,
        publicRegistration: false,
        invitationsActive: false,
        paidFallbackEnabled: false
      },
      checkedAt: new Date().toISOString()
    });
  }

  if (request.method !== 'GET' || !WRAPPED_PATHS.has(url.pathname)) return null;
  const response = await handleOwnerApi(request, env, url);
  const payload = await response.json();
  return json(augmentPayload(payload, request, env, url.pathname), response.status);
}

export const __test = { augmentPayload, currentSession, WRAPPED_PATHS };
