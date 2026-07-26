# Runtime Wave 5 Threat Model

| Threat | Control |
|---|---|
| Unauthorised operational access | Cloudflare Access plus owner-email boundary |
| Alert spam or external exfiltration | Dashboard-only destinations; webhooks denied |
| Unsafe automated rollback | Plans contain no commands and never execute |
| Deployment despite failed controls | Evidence gate blocks missing tests, security or rollback proof |
| Secret leakage in telemetry | Credential and email redaction |
| False monitoring assurance | No external probes; supplied-data provenance is explicit |
| Database side effects | No runtime bindings or write path |
| Unexpected cost | No paid monitoring or provider activation |
