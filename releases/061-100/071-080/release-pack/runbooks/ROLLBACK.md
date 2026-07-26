# Rollback procedure

1. Stop rollout and preserve request IDs and evidence.
2. Disable affected feature flags and write routes.
3. Revert to the last validated commit.
4. Restore the verified D1 backup when schema rollback is required.
5. Validate identity, tenant isolation, health, safety and critical journeys.
6. Record root cause, recovery evidence and corrective actions.
