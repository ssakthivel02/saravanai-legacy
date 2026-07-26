# Runtime Waves 7–11 Threat Model

| Threat | Primary control |
|---|---|
| Unauthorised private evaluation | Cloudflare Access JWT and owner-email boundary |
| Unsafe model release | Model card, evaluation, red-team, privacy, security and rollback evidence |
| Excessive personal-data retention | Classification and retention review boundaries |
| Unauthorised deletion or export | Planning-only responses; no record access or execution |
| SSRF through webhook configuration | HTTPS requirement and private/metadata target rejection |
| Breaking API release | Required-field and enum compatibility checks |
| Uncontrolled failover | Human-approved continuity gate; no execution capability |
| Misleading customer assurance | Unsigned, unpublished packets and no certification claims |
| Hidden spending | No paid evaluation, privacy, integration, resilience or assurance services |
