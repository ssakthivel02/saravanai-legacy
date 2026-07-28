# Build 018 Architecture — HLD and LLD

## High-level design

Request flow:

1. Cloudflare Access authenticates the approved identity.
2. `access-jwt.js` verifies the RS256 JWT, issuer, audience, expiry and exact-email role policy.
3. The Worker injects a verified role and pseudonymous profile key into the internal request only.
4. `tenant-context.js` derives a stable tenant ID and actor ID by hashing the verified profile key with a versioned namespace.
5. Build 017 endpoint authorisation evaluates the route and role.
6. `tenant-storage-policy.js` requires the D1 binding, schema version, identity enforcement, route authorisation and emergency-stop release.
7. The repository may perform tenant-scoped metadata reads only when every read gate is satisfied.
8. Writes remain unimplemented; a preview validates record and quota contracts without mutation.

## Trust boundaries

- Browser to Cloudflare Access: untrusted until Access completes authentication.
- Access to Worker: JWT must be cryptographically verified by the Worker.
- Internal request headers: trusted only when set after successful verification.
- Worker to D1: all queries must bind the server-derived tenant ID as the first partition key.
- Storage payload: encrypted ciphertext is required by schema; plaintext is prohibited.

## Low-level contracts

### Tenant identity

- Input: `x-sakthiai-access-verified`, role and pseudonymous profile key.
- Output: internal tenant ID and actor ID.
- Prohibited output: email, raw profile key, JWT, Access audience.

### Storage activation

Reads require:

- `TENANT_PERSISTENCE_ENABLED=true`
- `TENANT_PERSISTENCE_EMERGENCY_STOP=false`
- D1 binding present
- `TENANT_SCHEMA_VERSION=0009`
- Access JWT enforcement active
- endpoint authorisation active

Writes additionally require:

- `ACCESS_SERVER_MUTATIONS_ENABLED=true`
- `TENANT_SERVER_WRITES_ENABLED=true`

### Data model

- `tenant_profiles`: pseudonymous partition and role state.
- `tenant_records`: encrypted payload envelope and safe metadata.
- `tenant_usage_counters`: records, bytes and daily write counters.
- `tenant_deletion_requests`: approval-oriented deletion workflow.
- `tenant_migration_ledger`: migration checksum and evidence state.

### Query rule

Every tenant table query must include `tenant_id = ?1`. The tenant ID must come from verified server context, never request body, query string, form input or browser storage.

## Failure model

Missing identity, invalid role, invalid profile key, missing D1 binding, unverified schema, active emergency stop, incomplete authorisation, unavailable quota usage or unknown routes fail closed. No error response includes identity secrets.