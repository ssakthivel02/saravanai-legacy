# Runtime Wave 2 High-Level Design

Client
→ Cloudflare Access owner boundary
→ Wave 2 enabled gate
→ emergency-stop gate
→ bounded planner or control service
→ non-executable structured response

No route connects to D1, an AI model, an external network tool, email, deployment
system, payment service or production write interface.
