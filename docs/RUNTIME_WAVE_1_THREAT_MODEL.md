# Runtime Wave 1 Threat Model

| Threat | Wave 1 control |
|---|---|
| Spoofed user header | Require both Cloudflare Access email and JWT headers |
| Wrong authenticated user | Exact `OWNER_EMAIL` match |
| Tenant escape | Normalised tenant ID and equality boundary |
| Public mutation | No mutating action is allowlisted |
| Replay | Design includes idempotency schema; no side-effect route exists |
| Prompt secret leakage | Credential-shaped prompt detection |
| Output secret leakage | Blocking output-safety finding |
| PII exposure | Human-review finding; output is not stored |
| Paid-provider use | AI envelope forces Workers AI and paid selection false |
| Sensitive telemetry | Observability contains control/binding metadata only |
| Feature enabled accidentally | Disabled-by-default environment flag |
| Unsafe rollback | Single entry-route removal and feature-flag kill switch |
