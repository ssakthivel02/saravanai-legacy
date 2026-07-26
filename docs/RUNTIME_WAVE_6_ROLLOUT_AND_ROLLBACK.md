# Runtime Wave 6 Rollout and Rollback

At merge time keep `RUNTIME_WAVE6_ENABLED` absent or false and `RUNTIME_WAVE6_EMERGENCY_STOP` absent or true.

Do not execute `migrations/0008_runtime_wave6.sql`.

A future owner pilot requires Cloudflare Access, the encrypted `OWNER_EMAIL` runtime secret, `RUNTIME_WAVE6_ENABLED=true`, and `RUNTIME_WAVE6_EMERGENCY_STOP=false`.

Rollback by restoring the emergency stop, reverting the Wave 6 commit and rerunning all validation workflows.
