# Build 017 high-level design

## Context

Cloudflare Access authenticates an identity and Build 016 resolves its configured role. Build 017 adds the next boundary: determining whether that verified role may invoke a specific API route.

## Components

1. **Route catalogue** — deterministic route, method, role and mutation metadata.
2. **Authorisation middleware** — disabled-by-default enforcement after JWT verification.
3. **Safe denial contract** — no-store responses without identity leakage.
4. **Decision evidence contract** — metadata-only event object with no persistence.
5. **Build 017 platform overlay** — release and readiness reporting without rewriting legacy component history.
6. **Owner UI panel** — visible activation, route and audit state.

## Trust boundaries

- Cloudflare Access authenticates.
- `src/access-jwt.js` cryptographically verifies the assertion and injects trusted internal headers.
- `src/access-authorizer.js` accepts only those verified headers.
- Browser input can never assign or elevate a role.
- Unknown routes deny when enforcement is active.
- Server mutations require a second independent gate.

## Non-goals

No team invitation workflow, no D1 data sharing, no audit persistence, no billing, no public registration and no automatic Cloudflare configuration.
