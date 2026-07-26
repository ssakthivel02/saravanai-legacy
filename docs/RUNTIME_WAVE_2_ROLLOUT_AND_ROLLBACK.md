# Runtime Wave 2 Rollout and Rollback

## Merge posture

At merge time:

```text
RUNTIME_WAVE2_ENABLED is absent or false
RUNTIME_WAVE2_EMERGENCY_STOP is absent or true
```

The public status endpoint must report `operational: false`.

## Future owner pilot

Only after Wave 1 is confirmed stable:

```text
RUNTIME_WAVE2_ENABLED=true
RUNTIME_WAVE2_EMERGENCY_STOP=false
```

## Immediate stop

Set:

```text
RUNTIME_WAVE2_EMERGENCY_STOP=true
```

This blocks every private Wave 2 route before request-body processing.

## Code rollback

1. Keep emergency stop true.
2. Revert the Wave 2 commit.
3. Re-run existing SakthiAI and Wave 1 tests.
4. Do not execute `0004_runtime_wave2.sql`.
