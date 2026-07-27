import { createAccessDecisionEvent } from './access-audit-contract.js';
import { createAccessDenialResponse } from './access-denial.js';
import { ACCESS_AUTHORISATION_RELEASE, resolveAccessRoute } from './access-route-catalogue.js';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);

function enabled(value) {
  return TRUE_VALUES.has(String(value ?? '').trim().toLowerCase());
}

function verifiedIdentity(request) {
  const verified = request.headers.get('x-sakthiai-access-verified') === 'true';
  const role = request.headers.get('x-sakthiai-access-role') || 'unknown';
  return {
    verified,
    role: ['owner', 'member', 'reader'].includes(role) ? role : 'unknown'
  };
}

function decisionHeaders(request, route, decision, role) {
  const headers = new Headers(request.headers);
  headers.set('x-sakthiai-authorisation-release', ACCESS_AUTHORISATION_RELEASE);
  headers.set('x-sakthiai-authorisation-route', route.id);
  headers.set('x-sakthiai-authorisation-decision', decision);
  headers.set('x-sakthiai-authorisation-role', role);
  return headers;
}

export function accessRouteAuthorisationEnabled(env = {}) {
  return enabled(env.ACCESS_ROUTE_AUTHORIZATION_ENABLED);
}

export function accessServerMutationsEnabled(env = {}) {
  return enabled(env.ACCESS_SERVER_MUTATIONS_ENABLED);
}

export async function enforceRouteAuthorisation(request, env = {}, url = new URL(request.url)) {
  const route = resolveAccessRoute(url.pathname, request.method);
  if (!accessRouteAuthorisationEnabled(env)) {
    return {
      request,
      response: null,
      enforced: false,
      route,
      audit: createAccessDecisionEvent({
        routeId: route.id,
        method: request.method,
        role: route.public ? 'public' : 'unknown',
        decision: 'bypass-disabled',
        code: 'ACCESS_ROUTE_AUTHORIZATION_DISABLED',
        classification: route.classification,
        serverMutation: route.serverMutation
      })
    };
  }

  if (route.public) {
    return {
      request: new Request(request, { headers: decisionHeaders(request, route, 'allow', 'public') }),
      response: null,
      enforced: true,
      route,
      audit: createAccessDecisionEvent({
        routeId: route.id,
        method: request.method,
        role: 'public',
        decision: 'allow',
        code: 'ACCESS_PUBLIC_ROUTE_ALLOWED',
        classification: route.classification,
        serverMutation: false
      })
    };
  }

  const identity = verifiedIdentity(request);
  if (!identity.verified) {
    return {
      request,
      response: createAccessDenialResponse(request, {
        status: 401,
        code: 'ACCESS_VERIFIED_IDENTITY_REQUIRED',
        routeId: route.id,
        reason: 'A cryptographically verified Cloudflare Access profile is required.'
      }),
      enforced: true,
      route,
      audit: createAccessDecisionEvent({
        routeId: route.id,
        method: request.method,
        role: identity.role,
        decision: 'deny',
        code: 'ACCESS_VERIFIED_IDENTITY_REQUIRED',
        classification: route.classification,
        serverMutation: route.serverMutation
      })
    };
  }

  if (!route.roles.includes(identity.role)) {
    return {
      request,
      response: createAccessDenialResponse(request, {
        status: 403,
        code: route.roles.length ? 'ACCESS_ROLE_NOT_AUTHORISED' : 'ACCESS_ROUTE_UNCLASSIFIED',
        routeId: route.id,
        reason: route.roles.length
          ? 'The verified profile role is not authorised for this route.'
          : 'The route is not present in the approved authorisation catalogue.'
      }),
      enforced: true,
      route,
      audit: createAccessDecisionEvent({
        routeId: route.id,
        method: request.method,
        role: identity.role,
        decision: 'deny',
        code: route.roles.length ? 'ACCESS_ROLE_NOT_AUTHORISED' : 'ACCESS_ROUTE_UNCLASSIFIED',
        classification: route.classification,
        serverMutation: route.serverMutation
      })
    };
  }

  if (route.serverMutation && !accessServerMutationsEnabled(env)) {
    return {
      request,
      response: createAccessDenialResponse(request, {
        status: 503,
        code: 'ACCESS_SERVER_MUTATIONS_DISABLED',
        routeId: route.id,
        reason: 'Server-side mutation routes remain disabled until persistence, audit and rollback controls are activated.'
      }),
      enforced: true,
      route,
      audit: createAccessDecisionEvent({
        routeId: route.id,
        method: request.method,
        role: identity.role,
        decision: 'deny',
        code: 'ACCESS_SERVER_MUTATIONS_DISABLED',
        classification: route.classification,
        serverMutation: true
      })
    };
  }

  return {
    request: new Request(request, { headers: decisionHeaders(request, route, 'allow', identity.role) }),
    response: null,
    enforced: true,
    route,
    audit: createAccessDecisionEvent({
      routeId: route.id,
      method: request.method,
      role: identity.role,
      decision: 'allow',
      code: 'ACCESS_ROUTE_AUTHORISED',
      classification: route.classification,
      serverMutation: route.serverMutation
    })
  };
}

export const __test = { decisionHeaders, enabled, verifiedIdentity };
