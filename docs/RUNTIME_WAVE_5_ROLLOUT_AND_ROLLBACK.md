# Runtime Wave 5 Rollout and Rollback

At merge time keep `RUNTIME_WAVE5_ENABLED` absent or false and `RUNTIME_WAVE5_EMERGENCY_STOP` absent or true.

Do not execute `migrations/0007_runtime_wave5.sql`.

A future owner pilot requires Cloudflare Access, the encrypted OWNER_EMAIL runtime secret, `RUNTIME_WAVE5_ENABLED=true`, and `RUNTIME_WAVE5_EMERGENCY_STOP=false`.

Rollback by restoring the emergency stop, reverting the Wave 5 commit and rerunning all validation workflows.
