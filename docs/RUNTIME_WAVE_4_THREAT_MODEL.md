# Runtime Wave 4 Threat Model

| Threat | Control |
|---|---|
| Public tenant creation | Public workspace denied |
| Privilege escalation | Permission allowlist and deny-by-default |
| Public-link leakage | Public links disabled |
| Data exfiltration | Metadata-only exports; no generation |
| Premature deletion | Immediate deletion denied |
| PII in logs | Subject hash and no content logging |
| False compliance claim | No certification or audit claim |
| Unexpected cost | No paid provider, billing, email or export service |
