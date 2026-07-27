# Build 017 low-level design

## Request sequence

1. `src/entry.js` receives the request.
2. `enforceAccessJwt` runs first.
3. When JWT enforcement is disabled, existing behaviour is preserved.
4. `enforceRouteAuthorisation` resolves method and pathname against the catalogue.
5. When route authorisation is disabled, it returns a non-enforcing decision.
6. When enabled:
   - public status routes are allowed;
   - protected routes require `x-sakthiai-access-verified: true`;
   - role membership is evaluated;
   - unclassified routes deny;
   - server mutation routes require `ACCESS_SERVER_MUTATIONS_ENABLED=true`.
7. The original handler runs only after authorisation allows the request.

## Environment gates

- `ACCESS_JWT_ENFORCEMENT_ENABLED`
- `ACCESS_ROUTE_AUTHORIZATION_ENABLED`
- `ACCESS_SERVER_MUTATIONS_ENABLED`

All remain absent or false in repository defaults.

## Response safety

Denials contain code, route identifier, reason and request identifier. They omit email, subject, JWT, audience, profile key and configured allow lists.

## Audit contract

Decision events are immutable in-memory metadata objects. Build 017 does not call D1, R2, Logpush, Analytics Engine or an external logging provider.
