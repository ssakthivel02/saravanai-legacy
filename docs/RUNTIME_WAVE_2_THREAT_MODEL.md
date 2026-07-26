# Runtime Wave 2 Threat Model

| Threat | Control |
|---|---|
| Agent exceeds scope | Maximum eight steps and strict step allowlist |
| Arbitrary tool invocation | Fixed registry; unknown tools denied |
| External side effect | No external tool is registered |
| Tool lease treated as authority | Proposal explicitly non-authoritative and non-executable |
| Fake human approval | Endpoint cannot grant approval; claims are rejected |
| Single-owner approving high-risk work | High-risk class requires independent four-eyes review |
| Replay | Idempotency contract and future evidence schema |
| Unsafe automation | Every rollback action is manual |
| Emergency condition | Stop defaults active unless explicitly released |
| Accidental activation | Separate enable and stop-release variables |
| Hidden charge | No paid providers, billing or paid Cloudflare service added |
