# Threat model

Primary threats: account takeover, confused deputy, tenant escape, prompt injection,
secret exfiltration, unsafe tool execution, poisoned knowledge, memory over-retention,
telemetry leakage, supply-chain compromise and unauthorised production deployment.

Controls: Cloudflare Access verification, default-deny authorisation, tenant predicates,
step-up authentication, input/output safety inspection, tool allowlists, provenance,
retention enforcement, telemetry label allowlists, signed evidence and release approvals.
