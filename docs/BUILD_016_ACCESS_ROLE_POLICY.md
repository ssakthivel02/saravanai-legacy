# Owner Build 016 — Access Role Policy Foundation

## Purpose

Build 016 prepares a fail-closed, exact-email role contract for the SakthiAI owner workspace without admitting another user, enabling public registration, or claiming that browser-local data is shared across accounts.

The immediate production objective remains unchanged: activate and verify one owner account through Cloudflare Access first. Member and reader profiles are prepared as policy contracts only.

## Delivered

- Exact-email owner, member and reader policy compilation
- Owner-first admission rule
- Separate disabled-by-default gates for team and reader profiles
- Invalid email-entry detection
- Conflicting member/reader assignment detection
- Fail-closed JWT verification when the role policy is invalid
- Pseudonymous browser profile isolation retained for verified identities
- Safe role capability matrix
- New `GET /api/v1/platform/access/readiness` endpoint
- Configured profile counts without configured email disclosure
- Current verified role and capability reporting
- Live Owner & Access role-policy panel
- OpenAPI, unit tests, structural validation and PWA cache rotation

## Environment-variable contract

| Variable | Purpose | Build 016 default |
|---|---|---|
| `OWNER_EMAIL` | Exact encrypted owner email | Required for owner activation |
| `ACCESS_ALLOWED_EMAILS` | Backward-compatible exact member list | Empty or owner duplicate only during pilot |
| `ACCESS_MEMBER_EMAILS` | Exact future member list | Absent |
| `ACCESS_READER_EMAILS` | Exact future reader list | Absent |
| `ACCESS_TEAM_PROFILES_ENABLED` | Allows configured non-owner member profiles | Absent / false |
| `ACCESS_READER_PROFILES_ENABLED` | Allows configured reader profiles after team gate | Absent / false |
| `ACCESS_INVITATIONS_ENABLED` | Reserved invitation-request configuration signal | Absent / false; no active invitation service |
| `ACCESS_JWT_ENFORCEMENT_ENABLED` | Worker-side JWT enforcement | Keep false until owner edge-policy tests pass |

## Role model

### Owner

- Full workspace and research access
- Browser-local project, artifact, memory and usage control
- Approval decisions
- Manual Cloudflare administration outside SakthiAI
- First and only role approved for the initial production pilot

### Member

- Prepared for an isolated personal browser profile
- No access administration
- Approval requests only
- Private file and shared-data access remain disabled until server-side RBAC exists
- Disabled by default even when an email is configured

### Reader

- Read-only route model is documented but not released
- No approvals, memory changes or access administration
- Disabled until explicit team and reader gates, route-level authorisation and shared persistence are validated

## Security behaviour

1. `OWNER_EMAIL` must be a valid exact email.
2. Invalid configured entries make the policy invalid.
3. An address assigned to both member and reader roles creates a conflict.
4. Invalid or conflicting configuration returns `ACCESS_ROLE_POLICY_INVALID` and fails closed.
5. A configured non-owner address is denied while `ACCESS_TEAM_PROFILES_ENABLED` is absent or false.
6. A configured reader is denied until both team and reader gates are true.
7. Readiness responses expose counts, states and masked current-session identity only.
8. Full configured addresses, JWTs, Access AUD values and profile keys are not returned.

## Production activation boundary

No Cloudflare or secret change is performed by this build.

Complete GitHub issue `#39` from a trusted browser:

1. Create the whole-host Cloudflare Access application.
2. Use only the tested Google identity provider.
3. Allow the exact owner Gmail address.
4. Confirm the owner account is admitted.
5. Confirm another Google account is denied.
6. Configure `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, encrypted `OWNER_EMAIL` and owner-only `ACCESS_ALLOWED_EMAILS`.
7. Enable `ACCESS_JWT_ENFORCEMENT_ENABLED=true` only after the edge tests pass.
8. Verify `/api/v1/platform/session` and `/api/v1/platform/access/readiness`.

Keep these absent during the owner pilot:

- `ACCESS_MEMBER_EMAILS`
- `ACCESS_READER_EMAILS`
- `ACCESS_TEAM_PROFILES_ENABLED`
- `ACCESS_READER_PROFILES_ENABLED`
- `ACCESS_INVITATIONS_ENABLED`

## Why team access remains disabled

Authentication confirms identity. It does not by itself provide:

- Shared project ownership
- Server-side row-level authorisation
- Tenant isolation
- Durable cross-device profiles
- Administrative invitation lifecycle
- Server-enforced quotas
- Deletion and export workflows for each account
- Audit evidence for role changes

Current verified profiles use separate browser-local namespaces. That protects one browser profile from another on the same device, but it is not a shared multi-user data platform.

## Cost boundary

Build 016 requires no paid identity service and activates no paid provider. Cloudflare Zero Trust Free may be used for the owner pilot within its applicable limits. SakthiAI still fails closed rather than silently switching to a paid AI route.

## Validation

The Build 016 gate runs:

- Existing `npm test`
- Access JWT regression tests
- Access policy tests
- Role-policy UI state tests
- Platform release and readiness endpoint tests
- Structural safety validation
- Repository-default activation checks

## Rollback

Application-code rollback:

1. Revert the Build 016 merge commit.
2. Confirm Build 015 release/readiness endpoints remain healthy.
3. Clear the PWA site cache or reload after the service-worker rollback.

Cloudflare activation rollback:

1. Set `ACCESS_JWT_ENFORCEMENT_ENABLED=false`.
2. Correct the Team Domain, AUD and exact owner email settings.
3. Retest the owner and denied alternate account.
4. Do not add an `Everyone`, wildcard Gmail or bypass-all policy as a shortcut.

## Safety statement

Public registration remains disabled. Team profiles remain disabled by default. Reader profiles remain disabled by default. Invitation requests are not active. Shared persistence and server role enforcement are not enabled. No authentication setting is activated automatically. No billing, payment collection, paid fallback, migration or runtime-wave state is changed.
