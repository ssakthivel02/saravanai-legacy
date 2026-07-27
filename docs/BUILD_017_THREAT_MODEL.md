# Build 017 threat model

## Protected assets

- Owner administrative routes.
- Member work routes.
- Reader read-only boundaries.
- File and runtime mutation routes.
- Identity and role metadata.
- Paid-provider and production-write safety gates.

## Primary threats and controls

| Threat | Control |
|---|---|
| Browser forges a role header | Authorisation requires the internal verified marker written after JWT verification. |
| Unknown endpoint bypasses RBAC | Default denial for unclassified routes when enabled. |
| Reader invokes AI execution | Reader is absent from work-route role sets. |
| Member reaches owner security state | Owner-only catalogue entries. |
| Owner accidentally activates writes | Independent server-mutation gate remains false. |
| Denial response leaks identity | Safe denial contract omits identity fields. |
| Audit log becomes a personal-data store | Metadata-only contract; no persistence in Build 017. |
| Configuration mistake locks out owner | Disabled-by-default rollout and documented rollback. |
| Route catalogue drifts | Focused tests and structural validation. |

## Residual risks

- A future new route must be classified before authorisation activation.
- Existing browser-local data is not shared across devices.
- Cloudflare configuration remains a manual operational dependency.
- Persisted audit evidence requires a separate retention, access and deletion design.
