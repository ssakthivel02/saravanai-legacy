# Runtime Wave 2 Low-Level Design

- `boundary.js`: owner identity and disabled/emergency-stop state.
- `tool-registry.js`: fixed read/preview-only tool catalogue.
- `planner.js`: validates objective, step count, step types and tool references.
- `lease.js`: creates a time-bounded proposal with no authority or persistence.
- `approval.js`: classifies review level; cannot grant approval.
- `rollback.js`: allowlisted manual compensating actions only.
- `idempotency.js`: validates key format and payload hash without storage.
- `observability.js`: returns control posture without request content.
