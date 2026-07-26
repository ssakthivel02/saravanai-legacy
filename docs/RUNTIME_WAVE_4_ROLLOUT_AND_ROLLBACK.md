# Runtime Wave 4 Rollout and Rollback

At merge time keep `RUNTIME_WAVE4_ENABLED` absent or false and `RUNTIME_WAVE4_EMERGENCY_STOP` absent or true.

Do not execute `migrations/0006_runtime_wave4.sql`.

Rollback by keeping emergency stop active, reverting the Wave 4 commit and rerunning all validations.
