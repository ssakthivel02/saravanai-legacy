# Runtime Wave 3 Threat Model

| Threat | Control |
|---|---|
| SSRF through source URL | HTTPS-only, no credentials, loopback denied |
| Prompt injection in source | Quarantine marker detection |
| Secret leakage | Credential/private-key markers |
| Copyright over-quotation | Maximum quotation length metadata of 25 words |
| Fake factual verification | Citation endpoint states structure-only |
| Automated truth adjudication | Contradictions require human review |
| Stale current information | Category-specific temporal thresholds |
| Untrusted source tier | Strict allowlist for retrieval plans |
| Content retention | Preview and evidence content not stored |
| Autonomous correction | Correction plans are manual and approval-gated |
| Accidental activation | Enable plus emergency-stop release required |
| Unexpected cost | No fetch, AI, database or paid provider integration |
