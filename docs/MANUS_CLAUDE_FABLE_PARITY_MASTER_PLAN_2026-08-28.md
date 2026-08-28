# SakthiAI — Manus + Claude/Fable Capability Parity Master Plan

**Baseline date:** 2026-08-28  
**Scope:** Product capability capture, disadvantage-to-advantage conversion, execution architecture and delivery gates.  
**Rule:** Build functionally equivalent or superior capabilities using SakthiAI-owned/provider-neutral contracts. Do not copy proprietary source code, model weights, hidden prompts, protected UI, branding or trademarks.

## 1. Current market facts that drive this programme

### Manus ownership and August 2026 service change

Manus originated from Butterfly Effect and became part of Meta through an acquisition announced on 2025-12-29. Chinese regulators subsequently ordered the transaction unwound. In August 2026 Manus announced that it would return to independent operation. Public reporting indicates original investors are buying stakes back, with Tencent expected to become the largest shareholder while remaining a minority shareholder; the final cap table should be treated as transitional until formally settled.

For affected users in specified jurisdictions, Manus scheduled a data deletion/maintenance window from 2026-08-23 08:00 SGT through 2026-08-25 07:59 SGT. Those users temporarily lost access and were required to use backup/restore procedures. Manus stated this was a regulatory separation measure rather than a security breach.

**SakthiAI implication:** acquisition, regulation, provider policy or regional access must never be able to strand the user's project state. Portability, checkpoints, export, restore and local/multi-provider fallback are core product requirements, not optional backup features.

### Claude Fable 5

Anthropic launched Claude Fable 5 on 2026-06-09 as a fifth-generation, very high-capability model for long, difficult knowledge-work and coding tasks. Its strengths are model-level intelligence plus long-horizon agent execution. SakthiAI may target **Fable-class user experience and task completion**, but must not claim model-equivalence until independent benchmarks prove it.

## 2. Manus capability inventory to capture

### 2.1 Interaction and execution modes

- Lightweight Chat mode for fast answers, file/image/PDF understanding and web-enabled discussion.
- Agent mode for multi-step execution rather than answer-only chat.
- Plan Mode: create/edit/approve the execution plan before high-cost or high-impact work begins.
- Long-running task execution with visible progress and steering.
- Multiple concurrent tasks.
- Mobile, web and desktop continuity.

### 2.2 Research and multi-agent work

- Advanced/deep research with citations.
- Wide Research: decompose work into multiple parallel sub-agents and synthesize their results.
- Connector-assisted research across private/user-authorized sources.
- Authenticated Browser Operator for research behind user logins and subscription services.
- Research-to-artifact workflows: report -> slides -> spreadsheet -> website -> follow-up automation.

### 2.3 Project context and branching

- Projects with reusable files, instructions, skills, connectors and output standards.
- Projects that learn from completed tasks by proposing reusable updates.
- Branching from any conversation point into isolated parallel directions while preserving inherited context.
- Running-record project pattern: one main context, many derived deliverable branches.

### 2.4 Scheduling and automation

- Scheduled Tasks 2.0.
- Same-task recurring runs when history/context matters.
- Separate-run mode when each scheduled execution should be isolated.
- Scheduled work inside Projects.
- Scheduled actions inside generated web apps.
- Connector-aware scheduled tasks.
- Agent/execution-environment selection for schedules.
- Run history, upcoming-run views and calendar visibility.

### 2.5 Execution environments

- Temporary sandbox for code, analysis, document generation and web-app work.
- Persistent Cloud Computer: always-on Ubuntu environment, persistent filesystem, services and scripts.
- Local “My Computer” execution using user-approved folders and installed CLI/dev tools.
- Cloud browser plus local authenticated browser.
- Ability to initiate work remotely while an authorized desktop/browser completes the action.

### 2.6 Browser and computer operation

- Cloud browser for isolated browsing.
- Local browser operator using authenticated Chrome/Edge sessions.
- Visible action log and user takeover/interruption.
- API-triggerable browser automation.
- Multi-step navigation, extraction, form work and workflow automation.

### 2.7 Connectors and external systems

- Unified connector layer with MCP support.
- Gmail and Google Calendar.
- Google Drive.
- GitHub and software-delivery tools.
- Notion.
- Slack.
- Zoom.
- Airtable.
- HubSpot.
- Shopify.
- Similarweb and research/market-intelligence tools.
- Canva and design tooling.
- Mobbin/design-reference tooling.
- Supabase/database operations.
- Higgsfield and creative-generation integrations.
- ElevenLabs voice integration.
- Other connectors through open adapter/MCP contracts.

### 2.8 Artifact and application creation

- Native PowerPoint generation/editing with editable charts/tables.
- Slides generated from research, email, Slack, files and connected data.
- Documents and reports.
- Spreadsheet/data-analysis outputs.
- Website and web-app builder.
- Web deployment and hosting modes.
- Automatic publishing/continuous web updates.
- Database-backed web apps.
- Domain/deployment support.
- AI design workflows.
- Image generation.
- Video-generation workflows.
- Music generation.
- Voice/audio generation.
- Speaker notes and presentation-support outputs.
- Knowledge/style reuse from prior artifacts.

### 2.9 Collaboration and commercial controls

- Team collaboration on tasks.
- Concurrent task limits by tier.
- Scheduled task limits by tier.
- Credit/resource consumption model.
- Usage visibility and account controls.

## 3. Manus disadvantages SakthiAI must turn into advantages

| Manus weakness/risk | SakthiAI counter-design |
|---|---|
| Ownership/regulatory changes can affect service and data availability | User-owned encrypted export, scheduled backup, restore drills, region-independent task-state format and local fallback |
| Cloud dependence | Local-first execution lane plus self-hosted worker/cloud-computer option |
| Credit/tier limits can make heavy autonomous work expensive or unpredictable | Transparent compute/token budgets, per-task cost ceiling, free/local-first routing and user-supplied compute |
| Hosted web-app/cloud-computer dependence can create platform lock-in | One-click source, container, database-schema, migration and environment export |
| Closed/opaque internal orchestration | Show selected model/provider, task plan, tool calls, budget class, citations and limitations |
| Browser automation is intrinsically brittle | Connector/API first, DOM/Playwright second, visual computer-use last; automatic retry and takeover |
| Agent mistakes can cause real-world damage | Read/write separation, policy engine, scoped credentials, dry-run/action packet and explicit approval for consequential writes |
| Project self-learning can preserve a bad instruction | All persistent instruction/memory changes are proposed, diffed, versioned and reversible before acceptance |
| Persistent cloud computer expands attack surface | Per-tenant isolated VM/container, egress policy, secret vault, snapshots, patch lifecycle and kill switch |
| Provider/regional downtime | Checkpoint every long task; resume on another model/worker without restarting from zero |

## 4. Claude/Fable capability inventory to capture

### 4.1 Model-class routing

- Fable 5 class: hardest long-horizon coding, research, scientific and professional work.
- Opus 5 class: high-end daily reasoning/coding with better efficiency.
- Sonnet 5 class: lower-cost agentic reasoning, tool use, coding and high-volume work.
- User-selectable effort/budget levels.
- Automatic model escalation when task complexity justifies it.

### 4.2 Claude Chat

- High-quality conversational reasoning and writing.
- Multimodal input.
- Web search and web fetch.
- Current-source citations.
- Image results where useful.
- Files and code execution.

### 4.3 Research

- Agentic multi-search research where later searches depend on earlier findings.
- Multi-angle investigation.
- Citations and verifiable evidence.
- Private-source connectors combined with public-web research where authorized.

### 4.4 Cowork

- Plan -> decompose -> execute -> coordinate parallel workstreams -> deliver files/artifacts.
- Cloud sessions that continue without the user's computer remaining awake.
- Cross-device session continuity.
- Mid-task steering.
- Parallel sub-agents.
- Scheduled recurring tasks.
- Project context.
- Local file/browser/computer access through desktop bridge where required.
- Remote/mobile assignment of work to desktop environments.

### 4.5 Claude Code

- Full-repository understanding.
- Search/read/edit files.
- Run shell commands, tests and linters.
- Debug and root-cause failures.
- Git history analysis.
- Resolve merge conflicts.
- Create commits and pull requests.
- Non-interactive/headless mode for CI/automation.
- Resume/continue sessions.
- Explicit allowed/disallowed tool permissions.
- MCP integrations.
- Gateway/routing support.
- Project/user memory files and reusable development instructions.
- Live/shareable artifacts for PR walkthroughs, dashboards and release checklists.

### 4.6 Projects, memory and context portability

- Project knowledge, files and instructions.
- Persistent project memory.
- Personal memory.
- Memory import/export to support migration between AI providers.
- Context compaction and long-running task continuity.

### 4.7 Artifacts

- Standalone editable artifacts separated from the conversation.
- Interactive tools/apps/visualizations/content.
- Live artifacts for ongoing Cowork/Code sessions.
- Shareable artifact outputs.

### 4.8 Skills, plugins, sub-agents and hooks

- Skills: dynamically loaded instructions/scripts/resources for repeatable specialist work.
- Connectors: standardized access to external data/services.
- Plugins: bundles of skills, connectors, sub-agents and hooks.
- Organization-shared skills.
- Security scanning for third-party skills/plugins.
- MCP as the open tool/data connection layer.

### 4.9 Browser/computer operation

- Connector first when a reliable API exists.
- Browser automation second.
- Direct computer/screen interaction as fallback.
- Per-application permissions.
- Human oversight for consequential actions.

### 4.10 Enterprise and future-facing capabilities

- Organization capability controls.
- Auditability and permission policy.
- Security scanning for extensions/plugins.
- Usage controls and gateway integration.
- Claude Science-like specialist workbench pattern.
- Model Hardware Standard-like physical-device adapter as a future SakthiAI extension, subject to strong safety boundaries.

## 5. Claude/Fable disadvantages SakthiAI must turn into advantages

| Claude weakness/risk | SakthiAI counter-design |
|---|---|
| Closed model weights and hosted inference | Open-first/self-hosted primary lane; proprietary providers remain optional adapters |
| Frontier models can be expensive | Automatic cost-performance routing, token/compute budgets and task-level caps |
| Model access can change due to policy/export controls | No single frontier provider is a hard dependency; checkpointed tasks can fail over |
| Cowork/Code can consume substantially more quota than normal chat | Resource estimator before run; visible budget meter during run |
| Computer use can be slower and more error-prone than connectors | Enforce connector -> browser DOM -> visual screen hierarchy |
| Computer/browser access increases security risk | Per-app allow-list, per-folder scope, screenshot disclosure, stop button, no hidden background control |
| MCP/plugin ecosystems can introduce malicious tools or prompt injection | Signed manifests, provenance, static/dynamic scanning, least privilege and per-tool approval policy |
| Features differ by plan/device/admin configuration | SakthiAI exposes one capability registry with clear availability and fallback on every surface |
| Cloud session data creates platform dependency | Exportable project/task/memory/artifact format and optional self-hosted execution |
| Strong model can still make wrong decisions | Mandatory verifier/test/citation gates for high-impact workflows |

## 6. SakthiAI target architecture

### Plane A — Conversational Intelligence

- Fast Chat.
- Deep Chat.
- Source-only mode.
- Current Research mode.
- Tamil/English parity.
- Multimodal input.

### Plane B — Frontier Reasoning Mode

Working name: **Sakthi Frontier**. This is a capability mode, not a claim that one local model equals Fable 5.

Pipeline:

1. Complexity classifier.
2. Planner.
3. Context builder/retriever.
4. One or more specialist executors.
5. Tool runner.
6. Independent verifier/critic.
7. Test/evidence gate.
8. Synthesizer.
9. Checkpoint + resumable state.

Required techniques:

- adaptive inference effort;
- multi-pass reasoning;
- context compaction;
- retrieval and working-memory separation;
- parallel specialists;
- code/test execution;
- source-grounded verification;
- retry/escalation policy;
- deterministic task state and resume;
- explicit uncertainty and failure reporting.

**Benchmark rule:** Do not label Sakthi Frontier “Fable 5 equivalent” until external or reproducible internal evaluation demonstrates parity on representative coding, research, computer-use and professional-work benchmarks.

### Plane C — Agent / Cowork Runtime

- Plan Mode.
- User plan editing/approval.
- Task graph/DAG.
- Parallel sub-agents.
- Background workers.
- Progress timeline.
- Pause/resume/cancel.
- Mid-task steering.
- Durable checkpoints.
- Scheduled/conditional execution.

### Plane D — Projects, Memory and Branching

- Projects with files, instructions, skills, connectors and policies.
- Mainline + branch sessions.
- Branch-from-message semantics.
- Reversible versioned project instructions.
- Proposed memory updates, never silent mutation.
- Personal/project/team memory boundaries.
- Import/export of memory and projects.

### Plane E — Research Fabric

- Search orchestration.
- Wide Research multi-agent fan-out.
- Official-source preference.
- Citation graph.
- contradiction detection.
- freshness policy.
- source quality scoring.
- private connector sources plus public web.
- reproducible research manifest.

### Plane F — Tool and Connector Fabric

- MCP-compatible connector SDK.
- Native high-value connectors.
- OAuth/scoped credentials.
- read/write tool classification.
- policy engine.
- signed connector metadata.
- prompt-injection boundary and data-loss prevention.

### Plane G — Computer and Browser Fabric

Execution priority:

1. API/native connector.
2. Structured browser/DOM automation.
3. Local authenticated browser.
4. Direct screen/computer use.

Capabilities:

- isolated cloud browser;
- local browser companion;
- local computer/CLI companion;
- user-approved folders/apps;
- Playwright-style deterministic automation;
- visual fallback;
- live action stream;
- interrupt/takeover;
- sensitive-action pause.

### Plane H — Persistent Compute

SakthiAI equivalent of Cloud Computer:

- ephemeral task sandbox;
- optional persistent workspace;
- user-owned/self-hosted worker option;
- container or VM isolation;
- snapshots and restore;
- resource quotas;
- secrets vault;
- outbound network policy;
- audit events;
- automatic shutdown policies.

### Plane I — Artifact Studio

- DOCX/document.
- PDF.
- PPTX with editable charts/tables.
- XLSX/spreadsheets/dashboards.
- HTML/web apps.
- code/repository packages.
- diagrams.
- structured data exports.
- artifact preview + revision.
- evidence/provenance manifest.

### Plane J — Creative Studio

- image generation/editing;
- text-to-video and image-to-video;
- avatar/presenter video;
- TTS/STT;
- voice cloning only under explicit rights/consent controls;
- translation/dubbing;
- music/audio generation;
- timeline/project asset management.

The production architecture should prefer SakthiAI-controlled/self-hosted/open components where feasible, while keeping external creative providers optional and replaceable.

### Plane K — Coding Studio

- repository map and code search;
- issue-to-code workflow;
- editable plan;
- branch/worktree isolation;
- code edit/test/lint/build;
- dependency/security checks;
- Git commit/PR workflow;
- CI execution and failure analysis;
- review agent + test agent;
- rollback patch;
- headless automation API.

### Plane L — Automation and Scheduling

- one-time/recurring/conditional tasks;
- same-thread continuation or isolated-run option;
- Project-aware schedules;
- connector-aware schedules;
- web-app schedules;
- run calendar/history;
- retry/backoff;
- failure notifications;
- quota/budget limits;
- per-action approval policy.

### Plane M — Skills and Plugin Ecosystem

- reusable SakthiAI Skills.
- versioned prompt/workflow packs.
- scripts/resources/templates.
- sub-agent definitions.
- hooks.
- connectors.
- signed packages.
- security scanning.
- permissions manifest.
- organization/private marketplace.
- capability and license registry.

### Plane N — Governance, Resilience and Portability

- identity/tenant/RBAC.
- default deny.
- human approval for high-impact writes.
- immutable audit metadata.
- encryption.
- data classification/retention.
- legal hold/deletion workflow.
- provider/model transparency.
- local/cloud boundary visibility.
- task export/import.
- project export/import.
- memory export/import.
- artifact/source export.
- scheduled backups.
- restore verification.
- multi-provider failover.
- local fallback.

## 7. Required delivery waves

### P0 — Resilience + core agent semantics

1. Add canonical capability registry for Chat, Research, Frontier, Agent, Code, Artifacts, Computer, Scheduler and Creative modes.
2. Define portable Task State v1 schema: plan, subtasks, artifacts, citations, tool state, checkpoints, costs and approvals.
3. Implement Plan Mode contract with edit/approve/reject.
4. Implement conversation branching data model.
5. Implement proposed project-memory update workflow with diff/approval/rollback.
6. Implement scheduler contract with same-thread and isolated-run modes.
7. Add export/backup/restore contracts and recovery test fixtures.
8. Add provider failover semantics for long-running tasks.

### P1 — Research + multi-agent

1. Wide Research task fan-out and synthesis.
2. Source-quality and contradiction engine.
3. Parallel research workers with bounded budgets.
4. Research manifest and citation graph.
5. Frontier reasoning orchestrator with planner/executor/verifier pipeline.
6. Benchmark harness for coding/research/agent performance.

### P1 — Computer + coding runtime

1. Ephemeral sandbox.
2. Local CLI companion.
3. Browser automation service.
4. Authenticated-browser bridge.
5. Coding agent with branch/test/PR workflow.
6. Read/write permission classification and action packet.
7. Persistent-compute prototype behind owner-only feature flag.

### P2 — Artifact + app builder

1. DOCX/PDF/PPTX/XLSX artifact workers.
2. Live artifact preview/revision.
3. Website/web-app generation.
4. source/container/schema export.
5. database-backed app template.
6. scheduled app actions.

### P2 — Creative studio

1. image.
2. video.
3. voice/TTS/STT.
4. translation/dubbing.
5. avatar/presenter.
6. music/audio.
7. provenance/rights/consent metadata.

### P2 — Connectors + skills/plugins

1. MCP-compatible SDK.
2. signed connector/skill/plugin manifests.
3. security scanner.
4. Gmail/Calendar/Drive/GitHub/Slack/Notion baseline connectors.
5. connector revocation and scope dashboard.
6. organization skill library.

### P3 — Enterprise + physical-agent extension

1. tenant/team administration.
2. usage/budget dashboards.
3. policy packs.
4. audit export.
5. self-hosted execution-plane deployment.
6. regional data-plane option.
7. Model Hardware Standard-compatible research adapter only after dedicated safety review.

## 8. Acceptance gates

No capability is “complete” because a UI button exists. Every capability requires:

- user journey;
- API contract;
- threat model;
- data and retention policy;
- permission model;
- cost/quota behavior;
- tests;
- failure and rollback behavior;
- accessibility;
- Tamil/English parity where applicable;
- observability;
- export/portability behavior;
- production-state reporting;
- benchmark evidence for capability claims.

## 9. Explicit non-goals

- Do not clone Manus or Claude branding/UI pixel-for-pixel.
- Do not copy hidden prompts or proprietary code.
- Do not claim SakthiAI has reproduced Claude Fable 5 model weights or intelligence.
- Do not make Claude, Manus, OpenAI, Gemini, Kimi or any other paid external AI a mandatory production dependency.
- Do not enable high-impact autonomous writes without authorization policy and rollback.
- Do not hide provider, cost or failure information from the owner.

## 10. Primary public research references used for this 2026-08-28 baseline

- Manus service change: https://help.manus.im/en/articles/16147831-service-change-overview-what-s-happening-and-am-i-affected
- Manus Cloud Computer: https://help.manus.im/en/articles/15392111-what-is-the-cloud-computer
- Manus Chat vs Agent: https://help.manus.im/en/articles/11711128-what-are-the-differences-between-chat-mode-and-agent-mode
- Manus Wide Research: https://help.manus.im/en/articles/11960169-what-is-wide-research
- Manus Connectors: https://help.manus.im/en/articles/12231777-how-can-i-use-manus-connectors
- Manus My Computer: https://help.manus.im/en/articles/14178443-what-is-the-my-computer-feature-capable-of
- Manus Scheduled Tasks 2.0: https://manus.im/blog/manus-schedules
- Manus Branch: https://manus.im/blog/manus-branch
- Manus Browser Operator: https://manus.im/en/blog/manus-browser-operator
- Manus Projects self-updating: https://manus.im/blog/manus-projects-self-updating
- Claude Fable 5: https://www.anthropic.com/news/claude-fable-5-mythos-5
- Claude Opus 5: https://www.anthropic.com/news/claude-opus-5
- Claude Sonnet 5: https://www.anthropic.com/news/claude-sonnet-5
- Claude Cowork: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
- Claude Research: https://support.claude.com/en/articles/11088861-use-research-on-claude
- Claude web search: https://support.claude.com/en/articles/10684626-enable-and-use-web-search
- Claude computer use: https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork
- Claude scheduled tasks: https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork
- Claude skills: https://support.claude.com/en/articles/12512176-what-are-skills
- Claude plugins: https://support.claude.com/en/articles/13837440-use-plugins-in-claude
- Claude memory import/export: https://support.claude.com/en/articles/12123587-import-and-export-your-memory-from-claude
- Claude artifacts: https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- MCP: https://docs.anthropic.com/en/docs/mcp

This register must be revalidated periodically because product plans, model availability, ownership and feature availability can change.