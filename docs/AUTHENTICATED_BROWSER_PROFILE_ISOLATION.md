# Authenticated Browser Profile Isolation

## Objective

Prevent authenticated SakthiAI identities from sharing the same browser-local Projects, Conversations, Approvals, Memories, Knowledge Graph, Usage and privacy-lock state.

This layer complements Cloudflare Access authentication. It does not replace server-side tenancy and does not provide cross-device synchronisation.

## Isolation model

The Worker produces a deterministic pseudonymous profile key only after cryptographically verifying the Cloudflare Access JWT. The key is derived from the normalised email using SHA-256 and does not expose the email address.

The browser accepts only profile keys matching:

```text
profile-[24 lowercase hexadecimal characters]
```

For an authenticated identity, the existing local database name is mapped from:

```text
sakthiai-owner-platform
```

to:

```text
sakthiai-owner-platform-<profileKey>
```

The following keys are also profile-scoped:

- active project
- latest response
- daily request cap
- owner privacy-lock verifier
- session unlock expiry

## Existing owner data

When JWT enforcement is absent or disabled, SakthiAI continues to use the original `sakthiai-owner-platform` database and original localStorage keys. No data is copied, changed or deleted.

When a verified profile is activated for the first time, it receives a new empty isolated workspace. The old local-owner data remains intact. Migration or import of old data must be an explicit owner-reviewed action in a later release.

## Shared-device protection

A second verified identity receives a different profile key and therefore a different browser database, privacy-lock verifier and usage state. Switching identity through Cloudflare Access and reloading the application selects the corresponding local profile namespace.

This protection is limited to SakthiAI's browser data. Operating-system users should still use separate device accounts where possible. Browser extensions, malware, an unlocked operating-system account or physical access can defeat browser-only controls.

## Remaining public-launch gates

Before public registration or a ChatGPT-style multi-device account system:

1. Create D1 user, tenant, membership and session tables.
2. Enforce tenant and role filters on every server query and mutation.
3. Add invitation, suspension and revocation workflows.
4. Add server-side export and deletion.
5. Add rate limiting, abuse controls and security-event retention.
6. Add profile migration/import with conflict prevention.
7. Validate logout, account switching and shared-device behaviour.
8. Complete privacy notice, terms and data-retention controls.

## Activation boundary

This release does not enable Access. It activates browser profile partitioning automatically only when `/api/v1/platform/session` reports a cryptographically verified profile key. Until then, legacy owner behaviour remains unchanged.

No Cloudflare variable, D1 migration, paid service, runtime-wave flag, production write or public registration setting is added by this release.
