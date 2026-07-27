export const ACCESS_AUTHORISATION_RELEASE = 'endpoint-authorisation-foundation-1.0.0';

const READ_ROLES = Object.freeze(['owner', 'member', 'reader']);
const WORK_ROLES = Object.freeze(['owner', 'member']);
const OWNER_ONLY = Object.freeze(['owner']);

const exact = (pathname) => (candidate) => candidate === pathname;
const prefix = (pathname) => (candidate) => candidate === pathname || candidate.startsWith(`${pathname}/`);
const runtimeStatus = (candidate) => candidate === '/api/v1/runtime/status'
  || candidate === '/api/v1/runtime/programme/status'
  || /^\/api\/v1\/runtime\/v(?:[1-9]|[1-4][0-9]|50)\/status$/.test(candidate);

export const ACCESS_ROUTE_CATALOGUE = Object.freeze([
  Object.freeze({ id: 'public-health', match: exact('/health'), methods: ['GET'], roles: ['public'], classification: 'public-status', serverMutation: false }),
  Object.freeze({ id: 'public-platform-status', match: exact('/api/v1/status'), methods: ['GET'], roles: ['public'], classification: 'public-status', serverMutation: false }),
  Object.freeze({ id: 'public-runtime-status', match: runtimeStatus, methods: ['GET'], roles: ['public'], classification: 'public-status', serverMutation: false }),
  Object.freeze({ id: 'platform-release-read', match: exact('/api/v1/platform/release'), methods: ['GET'], roles: READ_ROLES, classification: 'profile-read', serverMutation: false }),
  Object.freeze({ id: 'platform-session-read', match: exact('/api/v1/platform/session'), methods: ['GET'], roles: READ_ROLES, classification: 'profile-read', serverMutation: false }),
  Object.freeze({ id: 'platform-capabilities-read', match: exact('/api/v1/platform/capabilities'), methods: ['GET'], roles: READ_ROLES, classification: 'profile-read', serverMutation: false }),
  Object.freeze({ id: 'mobile-config-read', match: exact('/api/v1/mobile/config'), methods: ['GET'], roles: READ_ROLES, classification: 'profile-read', serverMutation: false }),
  Object.freeze({ id: 'owner-access-readiness', match: exact('/api/v1/platform/access/readiness'), methods: ['GET'], roles: OWNER_ONLY, classification: 'owner-security-read', serverMutation: false }),
  Object.freeze({ id: 'owner-authorisation-readiness', match: exact('/api/v1/platform/access/authorisation'), methods: ['GET'], roles: OWNER_ONLY, classification: 'owner-security-read', serverMutation: false }),
  Object.freeze({ id: 'ai-chat', match: exact('/api/v1/chat'), methods: ['POST'], roles: WORK_ROLES, classification: 'ai-execution', serverMutation: false }),
  Object.freeze({ id: 'ai-chat-stream', match: exact('/api/v1/chat/stream'), methods: ['POST'], roles: WORK_ROLES, classification: 'ai-execution', serverMutation: false }),
  Object.freeze({ id: 'research-execution', match: exact('/api/v1/research'), methods: ['POST'], roles: WORK_ROLES, classification: 'research-execution', serverMutation: false }),
  Object.freeze({ id: 'file-capabilities-read', match: exact('/api/v1/files/capabilities'), methods: ['GET'], roles: READ_ROLES, classification: 'file-metadata-read', serverMutation: false }),
  Object.freeze({ id: 'file-owner-operations', match: prefix('/api/v1/files'), methods: ['POST', 'PUT', 'PATCH', 'DELETE'], roles: OWNER_ONLY, classification: 'owner-file-operation', serverMutation: true }),
  Object.freeze({ id: 'governance-owner-read', match: prefix('/api/v1/governance'), methods: ['GET'], roles: OWNER_ONLY, classification: 'owner-governance-read', serverMutation: false }),
  Object.freeze({ id: 'runtime-owner-control', match: prefix('/api/v1/runtime/programme'), methods: ['POST', 'PUT', 'PATCH', 'DELETE'], roles: OWNER_ONLY, classification: 'owner-runtime-control', serverMutation: true }),
  Object.freeze({ id: 'runtime-owner-read', match: prefix('/api/v1/runtime'), methods: ['GET'], roles: OWNER_ONLY, classification: 'owner-runtime-read', serverMutation: false })
]);

function normaliseMethod(value) {
  return String(value || 'GET').trim().toUpperCase();
}

function normalisePathname(value) {
  const pathname = String(value || '/').trim();
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function resolveAccessRoute(pathnameValue, methodValue = 'GET') {
  const pathname = normalisePathname(pathnameValue);
  const method = normaliseMethod(methodValue);
  for (const route of ACCESS_ROUTE_CATALOGUE) {
    if (route.methods.includes(method) && route.match(pathname)) {
      return {
        id: route.id,
        methods: [...route.methods],
        roles: [...route.roles],
        classification: route.classification,
        serverMutation: route.serverMutation === true,
        public: route.roles.includes('public')
      };
    }
  }
  return {
    id: 'unclassified-protected-route',
    methods: [method],
    roles: [],
    classification: 'unclassified',
    serverMutation: method !== 'GET' && method !== 'HEAD',
    public: false
  };
}

export function accessRouteCatalogueSummary() {
  const routeIds = ACCESS_ROUTE_CATALOGUE.map((route) => route.id);
  const publicRouteCount = ACCESS_ROUTE_CATALOGUE.filter((route) => route.roles.includes('public')).length;
  const ownerOnlyRouteCount = ACCESS_ROUTE_CATALOGUE.filter((route) => route.roles.length === 1 && route.roles[0] === 'owner').length;
  return {
    release: ACCESS_AUTHORISATION_RELEASE,
    defaultDecision: 'deny-unclassified-when-enabled',
    routeCount: routeIds.length,
    publicRouteCount,
    ownerOnlyRouteCount,
    roleSet: ['owner', 'member', 'reader'],
    routeIds,
    exactEmailDataIncluded: false,
    dynamicUserDataIncluded: false
  };
}

export const __test = { exact, prefix, runtimeStatus, normaliseMethod, normalisePathname };
