# SakthiAI Access Authentication and Profile Foundation

## Decision

Use Cloudflare Access as the authentication front door. Do not build a SakthiAI email-and-password database at this stage.

Cloudflare Access performs sign-in and policy enforcement. SakthiAI then performs defence-in-depth verification of the Access JWT before trusting identity headers. The foundation remains disabled until the Access application, issuer domain, audience tag and exact email allow-list are configured and tested.

## What this release does

- Adds RS256 validation of `Cf-Access-Jwt-Assertion`.
- Validates the Cloudflare Access issuer and application audience.
- Requires the JWT email claim to match the Access email header.
- Authorises only `OWNER_EMAIL` and exact addresses in `ACCESS_ALLOWED_EMAILS`.
- Produces `owner` or `member` role metadata.
- Produces a deterministic pseudonymous `profileKey` for later browser and D1 partitioning.
- Preserves the existing local-owner mode while enforcement is disabled.
- Leaves health and read-only runtime status routes available to the existing production smoke gate.

## What this release deliberately does not do

- It does not enable `ACCESS_JWT_ENFORCEMENT_ENABLED`.
- It does not create Cloudflare Access applications or policies.
- It does not create users automatically.
- It does not store passwords.
- It does not execute a D1 migration.
- It does not enable cross-device profile synchronisation.
- It does not claim tenant isolation or public multi-user readiness.
- It does not enable any runtime wave, write route, paid provider, billing or public registration.

## Authentication is not yet a complete profile system

Cloudflare Access answers: **Who is allowed to enter?**

A complete profile system must additionally answer:

1. Which SakthiAI user and tenant owns each record?
2. Which role may read, create, update, export or delete it?
3. How are local browser records separated on a shared device?
4. How are records synchronised across devices?
5. How are access revocation, account deletion and audit evidence handled?

The current Projects, Files, Artifact Studio, Approvals, Memory & Graph and Usage modules are browser-local. Authentication alone does not make those records cross-device or server-backed. The next gated stage must partition IndexedDB and localStorage by the verified `profileKey` before any second user is admitted to the same browser profile. D1 tenant tables and server-side authorisation are required before public registration.

## Zero-cost rollout choices

### Owner-only pilot

Use Cloudflare as the identity provider and restrict authentication to Cloudflare account members. Allow only the configured owner. This is the smallest pilot.

### Small invited-user pilot

Use either:

- One-time PIN to exact approved email addresses; or
- Google as an identity provider, with exact-email Access policies.

Do not create an `Include Everyone` policy. Do not use `Login Methods: One-time PIN` by itself as the allow rule because that permits every valid email identity.

## Required Cloudflare values before activation

| Variable | Type | Example purpose |
|---|---|---|
| `OWNER_EMAIL` | Secret | Exact owner email |
| `ACCESS_TEAM_DOMAIN` | Plaintext | `https://<team-name>.cloudflareaccess.com` |
| `ACCESS_AUD` | Secret or plaintext | Access Application Audience tag |
| `ACCESS_ALLOWED_EMAILS` | Secret | Comma-separated invited member emails; omit for owner-only |
| `ACCESS_JWT_ENFORCEMENT_ENABLED` | Plaintext | Keep absent or `false` until final validation |

## Safe activation sequence

1. Merge and deploy this disabled foundation.
2. Create a Cloudflare Access self-hosted application for `sakthiai.omsaravanabhava.org`.
3. Select one identity method for the first pilot.
4. Create an Allow policy containing only the exact owner email.
5. Set a short pilot session duration, such as eight hours.
6. Copy the team domain and Application Audience tag.
7. Add `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` to the Worker.
8. Confirm `OWNER_EMAIL` is the exact authenticated email.
9. Leave `ACCESS_ALLOWED_EMAILS` absent for the owner-only pilot.
10. Test login in a private browser window.
11. Confirm `/api/v1/platform/session` reports cryptographic verification and role `owner`.
12. Only then set `ACCESS_JWT_ENFORCEMENT_ENABLED=true`.
13. Verify the website, API session and all 52 production smoke endpoints.
14. Roll back by setting enforcement to `false` if validation fails.

## Before inviting another user

Do not add another email until browser profile isolation is implemented and validated. Without user-keyed local storage, two authenticated people using the same browser profile could share the existing browser-local workspace. The next quality task must implement local storage partitioning by the verified `profileKey`, migration-safe owner compatibility and tests for user switching.
