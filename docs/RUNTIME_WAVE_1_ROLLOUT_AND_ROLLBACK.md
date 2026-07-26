# Runtime Wave 1 Rollout and Rollback

## Owner pilot checks

```powershell
$base = "https://sakthiai.omsaravanabhava.org"

Invoke-RestMethod "$base/api/v1/runtime/status"

# The remaining routes should be tested from an authenticated Cloudflare Access
# browser/session or approved API client.
```

Expected status before activation:

```json
{
  "status": "ok",
  "release": "runtime-wave-1.0.0",
  "enabled": false,
  "productionWritesEnabled": false
}
```

## Rollback

1. Set `RUNTIME_WAVE1_ENABLED=false`.
2. Confirm `/api/v1/runtime/status` reports disabled.
3. Revert the Runtime Wave 1 commit if necessary.
4. Do not execute `0003_runtime_wave1.sql` as part of this pack.
5. Preserve only request IDs, timestamps and decision metadata required for review.
6. Re-run `npm test` and the existing SakthiAI validation.
