# Runtime Waves 7–11 Rollout and Rollback

At merge time keep all `RUNTIME_WAVE7_ENABLED` through `RUNTIME_WAVE11_ENABLED` variables absent. Keep all matching emergency-stop variables absent; absence resolves to stopped.

Do not execute migrations 0009 through 0013.

Future owner pilots must be activated one wave at a time, only after the public status endpoint, Access identity, OWNER_EMAIL secret, tests and rollback plan are independently verified.

Rollback by restoring the emergency stop, reverting the combined commit and validating Waves 1–6.
