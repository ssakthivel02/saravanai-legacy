# Runtime Wave 3 Rollout and Rollback

## Merge posture

Keep:

```text
RUNTIME_WAVE3_ENABLED absent or false
RUNTIME_WAVE3_EMERGENCY_STOP absent or true
```

Do not execute `migrations/0005_runtime_wave3.sql`.

## Future owner pilot

Only after Wave 1 and Wave 2 are stable:

```text
RUNTIME_WAVE3_ENABLED=true
RUNTIME_WAVE3_EMERGENCY_STOP=false
```

## Immediate stop

Set:

```text
RUNTIME_WAVE3_EMERGENCY_STOP=true
```

## Rollback

1. Keep the emergency stop active.
2. Revert the Wave 3 commit.
3. Re-run SakthiAI, Wave 1, Wave 2 and Wave 3 tests.
4. Confirm no migration was executed.
