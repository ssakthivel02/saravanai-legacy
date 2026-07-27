# SakthiAI Owner Build 015 — Access Readiness and Unified Release Contract

## Objective

Make the production state understandable before any Cloudflare Access activation. The owner must be able to see which identity controls are prepared, which are active, which profiles are allowed, whether reader/member invitations are enabled, and whether quotas or paid fallbacks are enforced.

## Delivered

- `GET /api/v1/platform/release`
- Unified owner build and component release metadata
- Live access-readiness panel in Owner & Access
- Current Worker JWT enforcement state
- Current verified role and masked identity state
- Explicit reader/member invitation boundary
- Browser soft-cap versus server hard-quota distinction
- Paid-fallback status
- PWA cache rotation for the readiness module
- OpenAPI contract and focused regression tests

## Release model

SakthiAI contains several independently versioned layers. Build 015 does not rewrite historical component versions. Instead, it exposes them under one contract:

- Platform release: `0.15.0-access-readiness`
- Security core: `0.11.0-owner-security`
- Governance foundation: `0.20.0-governance-foundation`
- Identity foundation: `access-auth-profile-foundation-1.0.0`
- Browser profile isolation: `authenticated-browser-profile-isolation-1.0.0`
- Research quality: `office-holder-evidence-resolver-1.0.0`
- Voice input: `continuous-explicit-stop-1.0.0`
- Runtime assurance: Waves 1–50 foundation

This prevents the UI from implying that every component shares one version number.

## Access state rules

### Activation pending

Displayed when Worker JWT enforcement is disabled. This is the expected state until the owner creates and tests the exact-email Cloudflare Access application.

### Authentication required

Displayed when enforcement is enabled but the current request does not have a verified profile. The safe response is to sign in or correct the Access issuer/audience configuration—not to create an Everyone policy.

### Verified owner

Displayed only when the Worker has cryptographically verified the Access JWT and assigned the owner role. The UI renders only the masked email, never the JWT, full profile key or full email.

## Reader and member boundary

Build 015 continues to report:

- reader profiles disabled;
- member invitations disabled;
- server-side role enforcement disabled;
- public registration disabled;
- cross-device profile synchronisation disabled;
- server writes disabled.

The Cloudflare identity test proves authentication connectivity; it does not implement shared application data or reader authorisation. No additional user should be admitted until server-side tenant and resource ACLs exist.

## Usage and cost boundary

The current owner request cap is a browser-local soft limit, defaulting to 50. It is not a server-enforced quota. Build 015 exposes that distinction explicitly.

The platform continues to report:

- premium providers disabled;
- paid fallback disabled;
- server hard quota disabled;
- free-first routing;
- fail-closed behaviour when a provider quota is unavailable.

## Security properties

- No authentication setting is activated by this release.
- No Cloudflare application or policy is modified.
- No secret is rendered in the UI.
- No complete email address is rendered by the readiness panel.
- No reader/member invitation is enabled.
- No server write path is enabled.
- No public registration is enabled.
- No paid provider or billing control is enabled.

## Manual production gate

After deployment:

1. Merge and deploy Build 015.
2. Confirm `/api/v1/platform/release` reports manual activation pending.
3. Create the exact-email Access application.
4. Test the approved owner and a denied alternate account.
5. Configure Access team domain and AUD secrets.
6. Enable Worker JWT enforcement.
7. Refresh Owner & Access and confirm Verified owner.
8. Keep reader/member access blocked.

## Rollback

If the readiness panel reports authentication required after activation:

1. Set `ACCESS_JWT_ENFORCEMENT_ENABLED=false`.
2. Preserve the edge Access application if the owner can still authenticate.
3. Correct team domain, AUD or exact-email secrets.
4. Re-enable enforcement only after verification.

Do not use a broad Everyone policy as a recovery mechanism.
