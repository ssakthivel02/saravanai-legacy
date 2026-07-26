# Runtime Wave 1 High-Level Design

Browser or API client
→ Cloudflare Access
→ Worker `src/entry.js`
→ Runtime Wave 1 handler
→ trusted identity resolution
→ tenant boundary
→ deny-by-default policy
→ bounded validation service
→ privacy-safe response

Existing chat, research, files, owner platform and governance handlers remain
unchanged. Runtime Wave 1 is additive and routes only `/api/v1/runtime/*`.
