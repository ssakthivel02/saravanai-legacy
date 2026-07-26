# Release 025 — Enterprise Knowledge Graph

## Objective

Tenant-scoped temporal nodes and edges with provenance, confidence, version history and evidence links.

## Security boundary

- Authentication is mandatory for non-public APIs.
- Tenant identifiers are derived from trusted identity context, not request bodies.
- Privileged decisions are logged with a request ID and decision ID.
- Production writes remain disabled unless explicitly approved.
- Paid providers, Unified Billing and autonomous production execution remain disabled.

## Acceptance criteria

- [ ] Positive and negative-path tests pass.
- [ ] Cross-tenant access is denied.
- [ ] No plaintext secrets or sensitive payloads are logged.
- [ ] API contract is documented.
- [ ] Migration and rollback have been reviewed.
- [ ] Evidence is captured with a SHA-256 checksum.
- [ ] Existing Releases 012–020 validation remains green.

## Rollback

Revert the integration commit, disable the release feature flag, and restore the previous
D1 backup if the migration was applied. Do not delete audit or evidence records.
