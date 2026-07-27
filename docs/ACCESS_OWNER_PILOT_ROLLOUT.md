# SakthiAI Owner-Only Cloudflare Access Pilot

## Status

Google identity-provider connectivity has passed the Cloudflare Zero Trust **Test** flow and returned the expected owner email. The repository already contains Worker-side RS256 Access JWT validation, exact-email allow-list checks and browser profile partitioning. The remaining activation is intentionally manual because it changes who can reach the production hostname.

## Objective

Protect the entire production hostname so only the explicitly approved owner Google account can reach SakthiAI. Public registration, wildcard Gmail access and team invitations remain disabled.

## Important boundary

Cloudflare Access protects hostnames and URL paths, not browser hash fragments. Routes such as `#workspace`, `#projects` and `#usage` are all the same origin path from Access's perspective. Protect the **whole hostname**, not individual hash routes.

## Phase 1 — Create the Access application

1. Open Cloudflare Zero Trust.
2. Go to **Access controls → Applications**.
3. Select **Add an application**.
4. Choose **Self-hosted**.
5. Set the application name to `SakthiAI Owner Workspace`.
6. Add the public hostname `sakthiai.omsaravanabhava.org` and leave the path blank so the whole host is protected.
7. Set a conservative session duration such as 8 or 12 hours.
8. Enable only the tested Google identity provider for this application. When one identity provider is enabled, use instant authentication if available.

## Phase 2 — Add the owner-only policy

Create an **Allow** policy with:

- Include: **Emails**
- Value: the exact owner Gmail address

Do not use:

- `Everyone`
- an `@gmail.com` domain rule
- `Emails ending in gmail.com`
- public signup
- a bypass rule for the whole application

Access policies are deny-by-default: a user who does not match the exact Allow rule must be denied.

## Phase 3 — Test the edge gate before Worker enforcement

1. Save the application while `ACCESS_JWT_ENFORCEMENT_ENABLED` is still absent or `false`.
2. Open a new private/incognito browser window.
3. Browse to the production hostname.
4. Confirm Google sign-in is displayed.
5. Sign in with the exact owner account and confirm SakthiAI opens.
6. In another private browser profile, try a different Google account and confirm Access denies it.

Do not continue until both the positive and negative tests pass.

## Phase 4 — Configure Worker-side JWT verification

Open **Workers & Pages → sakthiai → Settings → Variables and secrets** and configure:

- `ACCESS_TEAM_DOMAIN` = `https://sakthiai-nexus.cloudflareaccess.com`
- `ACCESS_AUD` = the Application Audience (AUD) tag copied from the new Access application
- `OWNER_EMAIL` = the existing encrypted owner email secret
- `ACCESS_ALLOWED_EMAILS` = owner email only during the pilot; store as a secret

Find the AUD under the Access application's configuration or additional settings. Copy the exact tag without spaces.

Only after those values are saved and the Access application test is successful, add:

- `ACCESS_JWT_ENFORCEMENT_ENABLED` = `true`

Deploy the configuration.

## Phase 5 — Verify the SakthiAI session contract

While signed in through Access, open:

`/api/v1/platform/session`

Expected conditions:

- `identity.authenticated` is `true`
- `identity.cryptographicallyVerified` is `true`
- `identity.role` is `owner`
- `identity.profileKey` is present
- `profileIsolationReady` is `true`
- `browserProfilePartitioningEnabled` is `true`
- `serverWritesAllowed` remains `false`
- `publicRegistration` remains `false`

Do not publish the exact profile key or JWT in screenshots.

## Rollback

If the Access login works but the Worker returns an authentication configuration error:

1. Set `ACCESS_JWT_ENFORCEMENT_ENABLED=false` first.
2. Confirm the owner can access the site through the Cloudflare Access policy.
3. Correct `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `OWNER_EMAIL` or `ACCESS_ALLOWED_EMAILS`.
4. Re-enable Worker enforcement only after verification.

If the owner is locked out at the Access layer, correct the exact-email policy. Do not create an `Everyone` production rule as a shortcut.

## Reader and member plan

Do not add reader/member users in the owner pilot. The current application separates browser-local data by verified profile, but shared server-side projects and read-only resource authorisation are not yet implemented. An invited user would receive a separate empty browser-local workspace rather than a governed shared reader view.

The safe later sequence is:

1. D1-backed tenant, project and membership records.
2. Server-side `owner`, `admin`, `member`, `reader` and `auditor` role checks on every API route.
3. Read-only project sharing and immutable audit evidence.
4. A separate public access-request hostname or custom denied page that collects no password and creates no account automatically.
5. Human owner approval followed by exact-email policy admission.

Until then, unauthorised users should see the Cloudflare Access denial experience and contact the owner through a separately published contact method.

## Cost boundary

This owner-only Access pilot does not enable paid AI providers, billing, public registration or server writes. Zero Trust plan limits and Cloudflare usage must still be monitored in the dashboard. SakthiAI must fail closed when a free allocation is exhausted rather than silently enable a paid service.
