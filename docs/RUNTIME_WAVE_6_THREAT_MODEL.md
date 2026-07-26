# Runtime Wave 6 Threat Model

| Threat | Control |
|---|---|
| Unauthorised supply-chain assessment | Cloudflare Access plus owner-email boundary |
| Malicious dependency | Critical, known-exploited and unmitigated high findings block |
| Secret committed to code | Bounded marker detection and redacted response |
| Workflow token abuse | Write permissions and PR secret exposure rejected |
| Unpinned third-party action | Full commit-SHA requirement |
| Public or unencrypted infrastructure | Structured IaC policy blocks |
| False provenance claim | Commit and digest validation; no signing claim |
| Automatic policy bypass | Exceptions require rationale, controls, owner and <=90 days |
| Unsafe automatic release | Human approval mandatory; auto-merge and deployment denied |
| Unexpected cost | No external scanner, registry, signing or paid service |
