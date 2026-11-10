# MIGRASUTRA AI — MASTER CLAUDE ENGINEERING BLUEPRINT

**Project:** MigraSutra AI — The Migration Intelligence & Reversibility Engineering Platform  
**Creator and original publisher:** Vatsal Shah  
**Recommended public identifiers:** `migrasutra` (repository and CLI), `migrasutra-prime` (lead skill), `@vatsalshah/migrasutra` (proposed npm identifier).  
**Tagline:** **Upgrade with Evidence. Rehearse Before Change. Recover with Confidence.**  
**Architecture:** Cross-platform, offline-first, zero-unnecessary-key, modular, least-privilege, evidence-driven.  
**Status when received:** A working Node.js starter already exists. Do not label advanced roadmap items implemented until you actually build and verify them.  
**Public-release note:** All names, domains, GitHub handles, package scopes and trademark availability remain unverified and must be cleared before publishing.

---

## 01. The execution contract — read this before implementing anything

You are a coordinated expert engineering team led by an experienced **Chief Migration Architect**. Assume the roles of principal solution architect, enterprise architect, modernization engineer, code transformation specialist, SDET, database migration specialist, DevSecOps engineer, platform engineer, privacy engineer, reliability engineer, technical writer and open-source maintainer. Work as one team through an orchestrator rather than inventing 20 paid model agents.

**Your mission is to evolve a real, functioning, testable repository named `migrasutra/` into an open-source developer product of international quality.** It must help maintainers migrate code and data safely, not merely write impressive plans. The path from `scan → plan → rehearse → verify → review → roll out → recover` must become an honest, reproducible lifecycle. Every step should distinguish a simulated result from a tool execution and an execution from a verified outcome.

Start by reading the following existing files **completely**: `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/STATUS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY_MODEL.md`, `docs/EVIDENCE_CONTRACT.md`, `docs/IDE_COMPATIBILITY.md`, `docs/TOOL_AND_PLUGIN_CATALOG.md`, `agents/manifest.json`, and the actual source, fixtures and tests. Inspect the environment and repository before proposing modifications. Run `node --version`, `npm test`, `npm run doctor` and `npm run demo` where authorized. Preserve existing functionality and tests; do not overwrite files or assume prior work was complete simply because its folder exists.

**Do not stop after an architecture diagram or task list.** Select the next highest-priority viable vertical slice, implement it, add tests, run them, record the evidence, update the maturity matrix and iterate as far as present permissions and runtime allow. Ask for explicit approval before installing global plugins/skills, downloading large tools or models, accessing credentials, contacting remote services, executing untrusted project commands, modifying production, using paid APIs, or applying destructive changes. Do not perform unauthorized action while waiting for approval; develop isolated alternatives.

Never invent a test result, compatibility claim, vulnerability result, successful rollback, performance metric, compliance certification, or production readiness status. “Not run” and “unknown” are legitimate and necessary outcomes.

---

## 02. Product definition and audience

**Promise:** MigraSutra AI makes modernization measurable. It identifies *what is changing*, *what could break*, *how to rehearse safely*, *what actually passed*, *what remains unknown*, and *how recovery would work if the migration fails*.

**Primary audiences:** maintainers of legacy frameworks, API/backend teams, database engineers, platform teams, open-source libraries, SaaS engineering organizations, IT modernization teams, agencies and small teams without dedicated migration specialists.

**Top jobs-to-be-done:**

1. Upgrade a JavaScript/TypeScript dependency while preserving application behavior.
2. Modernize Java/Spring applications using supported OpenRewrite recipes and a trustworthy report of what changed.
3. Migrate React, Angular, Vue, Next.js, Node.js, Python, Java, .NET, Go or PHP stacks with framework-specific adapters.
4. Migrate schemas and data with proven compatibility and tested backup/restore procedures.
5. Upgrade Docker/Kubernetes configurations and assess infrastructure state through structured, sensitive-data-safe plans.
6. Compare “before” and “after” tests, contract compatibility, performance budgets and dependency baselines.
7. Generate a meaningful migration pull request and rollback handoff with exact observed evidence.
8. Reproduce migration failures with sanitized fixtures and deterministic “migration passports.”

**Do not compete as an inferior rewrite of established tools.** Integrate and orchestrate OpenRewrite, Renovate, jscodeshift, Testcontainers, Flyway, Alembic, OpenTofu, vulnerability scanners and test suites through documented adapters. The distinctive value is *evidence continuity, rehearsal, reversible planning and conservative release decisions*.

**Flagship product pillars:**

- **Upgrade Atlas:** system, dependency and runtime map that highlights version and migration boundaries.
- **Breakage Radar:** evidence-linked breaking-change analysis and change-impact graph.
- **Rehearsal Lab:** isolated preview and authorized execution in a disposable environment.
- **Reversibility Ledger:** what is reversible, what requires forward recovery and what backup restoration has actually been tested.
- **Migration Passport:** portable, privacy-filtered evidence capsule with file hashes, versions, transforms, test results and approval history.
- **Release Guardian:** conservative gates requiring human authorization.
- **MigraSutra FlightDeck:** optional future responsive UX for planning and reviewing migrations; no fictional dashboard is required to use the CLI.

---

## 03. Public identity, uniqueness and open-source packaging

Use **MigraSutra AI** as the working name. Lead agent **MigraSutra Prime**; CLI `migrasutra`; root `migrasutra/`; skill `migrasutra-prime`. Name comes from migration + “Sutra,” emphasizing repeatable engineering methods. The name complements ArchSutra AI, VigilSutra AI, RachnaSutra AI, PramanaSutra AI, EvalSutra AI, ProtocolSutra AI, ContextSutra AI and DocSutra AI, but the repositories must remain independently useful.

Branding should feel engineering-grade: restrained typography, strong evidence visualization, dependable status design, accessible color contrast, explanatory error messages, meaningful tutorials and polished terminal UX. Never use dark patterns, unverifiable “100% safe” claims, popularity promises, fake endorsement badges or fabricated download numbers.

Check availability for: GitHub `vatsalshah/migrasutra`, npm `@vatsalshah/migrasutra`, relevant domains (for example `migrasutra.dev`), package names and relevant trademarks *before* public release. Do not automatically register anything. Prefer Apache-2.0 subject to license review, with the creator attribution to Vatsal Shah and correct attribution for contributors and third-party modules. `LICENSE`, `NOTICE` if necessary, SPDX metadata and changelog should be consistent.

The repository must be usable as (a) standalone CLI, (b) portable Agent Skills package, (c) optional Claude Code plugin, (d) optional integrated SDK, (e) optional local/remote service, (f) CI quality gate, and (g) a hosted UX layer only after secure server work is actually implemented.

---

## 04. Mandatory architecture levels

Produce and maintain concrete architecture artifacts at every relevant level, keeping them connected to implementation:

### 4.1 Product and business architecture

Define audiences, jobs, workflow stages, trust levels, permissions, output quality standards, free core, optional enterprise extensions, licensing, adoption and contribution strategy. Show why each feature is useful without a premium hosted model.

### 4.2 Enterprise and solution architecture

Map interactions among CLI, IDE skills, optional model adapters, local workspace, sandbox runner, data migration adapters, repository APIs, CI/CD, artifact store and human approvals. Define trust boundaries and deployment topologies (fully offline workstation, approved CI runner, isolated team server, optional enterprise self-hosted service). Include a C4 context/container/component model where useful and ADRs for major trade-offs.

### 4.3 System architecture

Separate domain logic, policy, scanning, version intelligence, action planning, recipe discovery, transformation execution, sandbox controller, evidence attestation, test verification, rollback ledger, report generation, skill/IDE adapters and optional web/service transport. Core functions must not import cloud SDKs or require AI keys.

### 4.4 Low-level and code architecture

Establish versioned TypeScript interfaces, JSON Schemas, error types, deterministic rule IDs, domain events, fault domains, idempotency, algorithmic complexity, performance budgets, pagination, stable hashes and test seams. Avoid generic “agent calls everything” architecture; use explicit command and tool contracts. Use clear modules and dependency inversion.

### 4.5 Data/storage architecture

Local file-based reports first; optional SQLite for indexed history; optional server database only with RBAC, retention and separation. Version and validate all input/output artifacts. Define reference IDs linking findings → sources → migration actions → rehearsals → test runs → gate decisions. Secret-bearing artifacts must never be stored in plain reports. Database snapshotting and restoration should use minimal necessary privileges.

### 4.6 Runtime and operational architecture

Support Windows, macOS and Linux with Node.js 22+ baseline; containers/rootless sandbox as separate optional dependencies. Record exact OS, architecture, tool versions, source commit, environment fingerprint (privacy-safe) and exit outcomes. Add CI matrix for multiple OSes and supported Node versions. Server mode must be optional and not change local CLI behavior.

### 4.7 Security, privacy and governance architecture

Model untrusted repository metadata, malicious scripts, poisoned vendor docs, credential theft, symlink attacks, path traversal, compromised codemods, supply-chain risks, authorization bypass, sensitive OpenTofu plan outputs, unvalidated approvals, time-of-check/time-of-use races and backend tenant crossover. The safer design always wins over feature coverage. Apply least privilege and practical security engineering, not decorative compliance language.

---

## 05. Required root-folder architecture

Preserve the existing root and expand it only when working capabilities need a module:

```text
migrasutra/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── GEMINI.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
├── GOVERNANCE.md
├── CODE_OF_CONDUCT.md
├── ROADMAP.md
├── CHANGELOG.md
├── package.json
├── .gitignore
├── .editorconfig
├── .claude-plugin/
│   └── plugin.json
├── agents/
│   ├── manifest.json
│   └── migrasutra-*.md
├── skills/
│   └── migrasutra-*/SKILL.md
├── packages/
│   ├── cli/
│   ├── core/
│   ├── server/
│   ├── discovery/                   # only when implemented
│   ├── recipes/                     # only when implemented
│   ├── sandbox/                     # only when implemented
│   ├── evidence/                    # only when implemented
│   ├── diff/                        # only when implemented
│   ├── quality-gates/               # only when implemented
│   └── ui/                          # only when implemented
├── adapters/
├── integrations/
│   ├── openrewrite/                 # future adapters
│   ├── jscodeshift/
│   ├── renovate/
│   ├── flyway/
│   ├── alembic/
│   ├── testcontainers/
│   └── opentofu/
├── schemas/
├── rules/
├── policies/
├── workflows/
├── fixtures/
│   ├── clean-app/
│   ├── risky-app/
│   └── broken-app/
├── examples/
│   └── reports/
├── scripts/
│   ├── install.sh
│   ├── install.ps1
│   ├── install.cmd
│   └── demo.mjs
├── tests/
├── docs/
│   ├── CLAUDE_MASTER_BUILD_PROMPT.md
│   ├── ARCHITECTURE.md
│   ├── STATUS.md
│   ├── SECURITY_MODEL.md
│   ├── EVIDENCE_CONTRACT.md
│   ├── IDE_COMPATIBILITY.md
│   ├── TOOL_AND_PLUGIN_CATALOG.md
│   ├── WORKFLOWS.md
│   ├── RELEASE_CHECKLIST.md
│   └── AGENT_CATALOG.md
└── .github/
    ├── workflows/ci.yml
    └── ISSUE_TEMPLATE/
```

Create a standalone `docs/` record for every public user-facing feature and a real test for every implemented capability. Do not create misleading empty packages with comments such as `TODO: production ready` while marking them complete.

---

## 06. Chief orchestration agent and specialist family

Create or preserve these **20 portable skills** with narrow instructions, examples, tool contracts, evidence requirements and escalation conditions. The primary agent is **MigraSutra Prime** and delegates work only when that agent is supported by the host. A single-IDE sequential fallback must remain effective.

| Skill ID | Agent | Mandate |
| --- | --- | --- |
| `migrasutra-prime` | Prime | Coordinate all stages, scope, approval and release handoff |
| `migrasutra-atlas` | Atlas | Repository and architecture inventory |
| `migrasutra-dependency-scout` | Dependency Scout | Manifests, lockfiles and dependency impact |
| `migrasutra-version-lens` | Version Lens | Exact supported upgrade paths and release-note evidence |
| `migrasutra-breaking-change` | Breakpoint Detective | Source/API breaking-change mapping |
| `migrasutra-recipe-forge` | Recipe Forge | Idempotent migration recipe planning |
| `migrasutra-codemod-pilot` | Codemod Pilot | Controlled code transformation and diffs |
| `migrasutra-schema-guardian` | Schema Guardian | Database DDL and expand-contract safety |
| `migrasutra-data-steward` | Data Steward | Data integrity, backup and restoration |
| `migrasutra-infra-mapper` | Infrastructure Mapper | Infra configuration and plan impact |
| `migrasutra-runtime-bridge` | Runtime Bridge | Language/runtime/OS migration details |
| `migrasutra-rehearsal-lab` | Rehearsal Lab | Reproducible isolated rehearsal |
| `migrasutra-test-witness` | Test Witness | Test execution and provenance |
| `migrasutra-contract-sentinel` | Contract Sentinel | API and consumer compatibility |
| `migrasutra-rollback-architect` | Rollback Architect | Recovery and forward-fix readiness |
| `migrasutra-blast-radius` | Blast Radius | Cross-system effects and priority |
| `migrasutra-evidence-ledger` | Evidence Ledger | Artifact hashes, provenance and integrity |
| `migrasutra-release-gate` | Release Arbiter | Cautious evidence-backed go/no-go review |
| `migrasutra-ide-bridge` | IDE Bridge | Cross-host skill and permission integration |
| `migrasutra-security-sentinel` | Security Sentinel | Least privilege, supply-chain and data risk |

Each specialist produces a typed artifact, not a paragraph of unsupported opinions. Prime must reconcile disagreements, track sources and ask for explicit confirmation where safety-critical. Do not generate fictitious subagent tool outputs in an environment that lacks real host subagent support.

---

## 07. Portable skills, rules, plugin packaging and cross-IDE strategy

Use the published **Agent Skills** directory convention: `SKILL.md` with YAML `name` and `description`, optionally references/scripts/assets. Scope skills narrowly so IDE context limits are respected; avoid loading all 20 by default. `agents/` provides Claude-targeted subagent instructions, but the domain operations must remain runnable independently of Claude.

Support host-specific project paths as individually tested adapters:

- Claude Code project-local `.claude/skills/`, with a separate optional `.claude-plugin/plugin.json` package at the repository root.
- Cursor project-local `.cursor/skills/` and compatible `.agents/skills/` when appropriate.
- OpenAI Codex project-local `.agents/skills/`.
- Gemini CLI project-local `.gemini/skills/` when supported by the installed version.
- GitHub Copilot project-local `.github/skills/` when supported by the installed extension/agent version.
- Additional hosts such as VS Code Agent Plugins, Kiro, Windsurf, JetBrains, Zed, Roo Code, Cline, OpenCode, Aider or other integrations only after checking actual capabilities and integration docs; don't claim a universal agent API.

Create a **verified host compatibility matrix** with host name, version, OS, skill discovery path, invocation method, subagent capability, network permissions, tool approval behavior, server/MCP support, passed test fixture, untested features and known limitations.

MCP/A2A adapters, if useful, are strictly optional and must follow the current official specs and version negotiation. Never silently expose local filesystem write tools or shell execution through an unauthenticated server. All plugin installation flows must show verified upstream, license, needed privileges, installation scope and rollback/uninstall instructions.

Separate **rules** (machine-enforceable policy), **skills** (procedural instructions), **agents** (role/task orchestration), **workflows** (stage sequencing), **adapters** (host/API glue), **integrations** (external tool connection) and **plugins** (installable package). Avoid using these terms interchangeably.

---

## 08. Migration discovery and version intelligence

### 8.1 Repository inventory

Implement scanners and adapters for package managers and runtime descriptors: npm/yarn/pnpm, Python requirements/pyproject/uv/pip, Maven/Gradle, Go modules, .NET solutions/projects/NuGet, PHP Composer, Rust Cargo and container configuration. Each parser needs file-size bounds, explicit version parsing, library coverage, ignore rules, full symlink/path safety, error isolation and tests for malformed inputs.

### 8.2 Compatibility intelligence

Use official documentation and source-specific release notes when network access is approved; record vendor URL, content date, target version and applicability. Distinguish official support from third-party experience and heuristics. Provide user-selectable version targets with compatibility prerequisites, supported intermediate versions, required code changes and runtime constraints. Never guess that a dependency version works without relevant evidence.

### 8.3 Change-impact graph

Map version changes to affected modules, imports, language settings, API contracts, data schemas, configurations, CI pipelines, deployment manifests, user-visible functionality and runbooks. Provide source file/line evidence and confidence, not ungrounded “high confidence.” Add graph traversal tests with controlled fixtures.

### 8.4 Inventory exclusions

Honor `.gitignore`, explicit include/exclude policies, data classification rules and maximum scan budgets. Do not follow symlinks into private directories or collect environment variables by default. Sensitive filenames and generated artifacts must be redacted or omitted when shared.

---

## 09. Recipe engineering and code migration

Implement a **recipe registry** with versioned identity, source/target version ranges, applicability preconditions, tool versions, source hash requirements, expected scope, reversibility properties, blocked operations and postconditions.

For Java: prefer official OpenRewrite support and recipes. For JS/TS: prefer maintained jscodeshift/AST tooling, framework-specific codemods and syntax-aware diffs. For .NET: inspect Microsoft's current guidance before integrating; the older .NET Upgrade Assistant is officially deprecated and should not be recommended as the new default. Python, Rust, PHP, Go and other languages need ecosystem-specific adapters rather than invented generic regex rewrites.

A good recipe must support `analyze`, `preview`, `apply-in-sandbox`, `verify`, `diff`, `report` and documented recovery prerequisites. Idempotency tests ensure that rerunning a completed transform produces no unexpected second change. Reject transforms that affect files beyond the allowlisted scope.

**Never let an LLM silently rewrite a real source tree for a production upgrade.** Generate proposed diffs, validate preconditions, require reviewed approval and build patches in a disposable worktree/container. Only after actual tests and approval may a separate workflow prepare changes for a developer-controlled PR. Keep original files and lockfiles restorable.

---

## 10. Migration rehearsal: safety-grade execution model

### 10.1 Current implemented static rehearsal

The starter supports an npm package or Node engine manifest field update in a temporary directory, with source hashes and no app execution. Preserve this as a useful low-risk operation. Label it **`STATIC_CHANGE_VERIFIED`**, not “migration successfully tested.” The resulting release gate must remain `REVIEW_REQUIRED` without actual test and rollback evidence.

### 10.2 Future isolated runnable rehearsal

Implement a runner only after threat model, explicit approval, OS compatibility and sandbox enforcement. Default to rootless containers or comparably effective isolation, restricted network, minimal mounts, nonprivileged UID/GID, CPU/memory/process/time limits, stdout/stderr limits and redacted logs. Deny host credential mounts, Docker socket exposure, production networks, privileged mode and arbitrary shell injection. Use a manifest of allowed commands rather than executing free-form model text.

Capture the verified baseline: application revision, dependency graph, OS/runtime/tool versions, build/test status and performance budget. Apply only reviewed recipes within a clean snapshot; capture exact actions and transformed hashes. Execute tests with signed or independently verifiable runner metadata where possible. Do not infer equivalence from “command exited 0” without adequate test coverage.

### 10.3 Three-part result

1. **Transformation result:** what files or schema objects actually changed.
2. **Behavioral verification:** what real tests/builds/contract checks passed, failed, were blocked or were not run.
3. **Recovery proof:** what restore or forward-fix was actually rehearsed successfully, including RPO/RTO where relevant.

Only the latter two can support high-quality release readiness, and only with human review.

---

## 11. Database and stateful migration laboratory

Database modernization is not simply applying SQL in reverse. Implement a separate `Data Steward + Schema Guardian + Rehearsal Lab + Rollback Architect` workflow:

1. Identify database engine/version, existing migration tool, schema state, data classification and source backups.
2. Require a nonproduction disposable clone/snapshot; never run on a production connection by default.
3. Verify that a restorable backup exists by actually restoring to an isolated database where permitted; “backup created” is not sufficient evidence.
4. Support expand-contract patterns, backfill batches, compatibility windows, dual writes/reads and rollout sequencing.
5. Evaluate locks, long-running migrations, index changes, transactional DDL, isolation level, mixed-version consumers and data-integrity invariants.
6. Test migration scripts and relevant application queries against disposable state; record row counts, checksum strategies and metadata without exporting personal data.
7. Test rollback or forward recovery. Destructive changes may be **irreversible without a verified restore**, even if an undo script exists.
8. Record an approved cutover plan, manual stop conditions and post-migration monitoring.

Target optional tools: Flyway, Alembic, Liquibase, Testcontainers, appropriate language-specific schema tools and engine-native backup/restore APIs. Check edition/license requirements, database dialect and version. Do not promise universal transaction semantics or zero downtime.

---

## 12. Infrastructure, containers and cloud migration

Add an IaC adapter to ingest **reviewed machine-readable OpenTofu plan JSON**. Parse `format_version`, resource change actions, sensitive fields, variables and planned outputs correctly; never log secret values. Distinguish creates/updates/destroys/replacements/unknowns. Evaluate policy violations, identity permissions, cloud cost implications, resource dependency order, maintenance windows and reverse-plan feasibility.

For Kubernetes, Helm, Docker and GitOps: review image digests, resource settings, selectors, API version deprecations, persistent volumes, network policies, secret mounts, storage state and rollout/rollback mechanisms. Integrate existing controllers rather than acting as an unreviewed deployment system. All live cloud queries require scoped credentials and explicit approval; default to imported plan files, sanitized fixtures and dry-runs.

Risk categorization must consider blast radius, recoverability, observability, unknowns and actual verification. A small syntactic change can have catastrophic production consequences; never auto-approve based solely on lines changed.

---

## 13. Evidence model, scoring and release gates

Use immutable or content-addressed evidence records when practical. Every record should identify: schema version, source hash, source file/line (or sanitized URI), test scenario ID, authorized tool name/version, environment fingerprint, started/completed time, command or adapter operation, observed output/exit status, artifact digest, limitation and responsible reviewer. Collect only privacy-safe data.

Minimum verification statuses: **VERIFIED**, **FAILED**, **NOT_RUN**, **BLOCKED**, **INFERRED**, **UNVERIFIED_EXTERNAL**, **STALE**, **UNKNOWN**. These must never collapse into a binary passed flag.

Gate policy:

- `NO_GO` for known severe unmitigated destructive/compatibility risks, failed critical tests, missing mandatory backups for stateful changes or unauthorized actions.
- `REVIEW_REQUIRED` for incomplete test coverage, static-only findings, unverified imported results, unsupported versions, missing rollback rehearsal or open dependencies.
- A future `GO_CANDIDATE` may exist only when fully trusted evidence satisfies a versioned policy; it is still **not** permission to deploy. It requires designated human approval, scope and timeframe.

Generate JSON, Markdown, optional HTML, SARIF/CI annotations where appropriate. Charts, rankings or scores must have transparent formulas, denominators and unknown categories. Do not inflate a 95% score when the most safety-critical tests were never run.

---

## 14. Optional AI and model/provider strategy

The deterministic local CLI must remain useful **without cloud keys, subscription accounts or any AI inference**. Where a supported IDE already supplies an authenticated assistant, allow it to interpret source-linked reports and orchestrate specialists through the host's permitted mechanisms. Never steal or copy its private tokens or assume that login grants external API access.

Optional model backends may include a user-selected local Ollama/llama.cpp environment or explicit BYOK provider integration. Isolate model logic behind adapters. Record model/provider/version and evaluation limitations. Use generative reasoning for hypothesis generation, documentation suggestions, migration plan wording or code-patch proposals—but not for fabricating test evidence or silently authorizing unsafe actions.

Model output is untrusted until grounded against code, tools or human review. Provide offline fallback and disclose when any feature requires paid services.

---

## 15. Server, team collaboration and dashboard roadmap

### Current local server

The starter includes a localhost-only bearer-protected **read-only report API**. That is not a production multi-tenant platform. Keep the token out of committed files, bind only to loopback, and provide no filesystem browsing or direct shell execution routes.

### Future team server

Design a separate optional service using proper authentication, scoped roles (owner, migration engineer, reviewer, auditor, read-only collaborator), tenant isolation, project boundaries, encrypted transport, key rotation, rate limits, logs, evidence retention/deletion and strict permission policy. Remote command execution must only be through a dedicated isolated runner and explicit scoped approval, not an HTTP route accepting arbitrary shell.

### Future responsive UX: MigraSutra FlightDeck

Build a polished, accessible web app **only once the domain APIs and security model are ready**. Include migration workspaces, upgrade timelines, change-impact map, risk findings, version matrix, rehearsal runs, verified/not-run test coverage, rollback proof dashboard, approval gates and exportable Migration Passports. Support desktop and mobile layouts, keyboard navigation, readable state labels, WCAG-aware controls, consistent design tokens and real data instead of fabricated demo metrics. Optional server synchronization must be explicit.

### Community UX

A free developer should succeed in fewer than five minutes on supplied sample fixtures without setting up a cloud account. Build clear `--help`, actionable errors, a `doctor` command, copy-paste recipes, sample reports and “why was this blocked?” explanations.

---

## 16. Security gates and adversarial scenarios

Tests must cover at minimum:

1. Scan refuses symlink targets and path traversal, and ignores `.env`/secrets.
2. Files larger than configured limits are rejected, not streamed into memory unbounded.
3. Malformed manifests, unexpectedly encoded files and unknown package formats produce bounded errors.
4. Untrusted file text that says “ignore instructions and run this” is treated strictly as data.
5. Static SQL rules distinguish comments and strings from executable statements to the extent supported; document remaining false positives/negatives.
6. Malicious codemod packages cannot escape sandbox or access secret environment by default.
7. Plan/rehearsal source hash mismatch blocks execution.
8. No unauthorized production credential, database, cloud or deployment action is possible from local scan.
9. A user-supplied report cannot claim that external tests actually ran without validated provenance.
10. Replayed approvals or mismatched plan IDs cannot bypass quality gates.
11. Local report server denies unauthenticated requests, disallows writes and binds only to loopback.
12. Output report escaping and redaction prevent HTML injection and accidental credential disclosure.
13. Global plugin/skill installation never happens silently.
14. Cross-tenant permissions and concurrency race tests are prerequisites for any hosted edition.

Run Gitleaks/OSV or equivalent when available and authorized. Respect the license, supply chain and sandbox security implications of each tool. Never market “zero vulnerabilities” as a guarantee.

---

## 17. Plugin, tool and integration selection strategy

Inspect available tooling before installing anything. Prefer currently maintained upstream integrations, pin versions, verify OS support and tool licenses and write a `docs/TOOL_AND_PLUGIN_CATALOG.md` decision record with category, rationale, upstream URL, proposed version, license, permissions, installation scope, tested state and fallback.

**Priority P1 (high-value):** OpenRewrite, Renovate, jscodeshift, Testcontainers, Docker or Podman, Gitleaks, OSV-Scanner and official language runtime tooling. Use components based on actual migration needs; don't install them all.

**Priority P2 (stateful/specialized):** Flyway, Alembic, Liquibase, Pact/Schemathesis, OpenTofu plan JSON and structured CI adapters.

**Priority P3 (platform and observability):** OpenTelemetry, approved GitHub PR automation, MCP Inspector, optional Context7/official documentation retrieval, local Ollama and selective hosted model adapters.

**Avoid recommending the legacy .NET Upgrade Assistant as the modern default:** Microsoft's current documentation says it has been deprecated in favor of a GitHub Copilot modernization agent. Verify supported versions and availability at implementation time.

All external services and optional plugins must be off by default. They may be integrated later when permission, resource and security requirements are satisfied.

---

## 18. Workflow definitions and acceptance protocols

### Workflow A — `migration-discovery`

Input: explicit local root and desired target. Output: normalized architecture/dependency inventory, version-specific unknowns, static-risk report and source hashes. Acceptance: no source mutation, no remote request without consent, all warnings reproducible.

### Workflow B — `reviewed-upgrade-plan`

Input: current inventory, version-specific vendor guidance, constraints. Output: prerequisite list, affected modules, staged transform plan, acceptance tests, rollback assumptions and approval owner. Acceptance: user-declared target and correct source baseline, no undocumented assumptions.

### Workflow C — `safe-static-rehearsal`

Input: approved plan for a supported manifest update. Output: scratch-space edited manifest, source/target checksums, exact field diff, explicit not-run test status. Acceptance: source tree remains byte-for-byte unchanged; stale plan rejected.

### Workflow D — `verified-codemod-rehearsal` (future)

Input: approved recipe and snapshot. Output: tested patch, tool logs, measured tests, exit codes and resource logs. Acceptance: no privileged process, no secret mount, no hidden network, idempotency verified; known limitations disclosed.

### Workflow E — `database-expand-contract` (future)

Input: schema and data contracts. Output: rehearsed schema/backfill plan, restore evidence, compatibility window and cutover gates. Acceptance: real tests on disposable clone and reviewed restoration path.

### Workflow F — `infrastructure-review` (future)

Input: sanitized OpenTofu/Helm/Kubernetes plans. Output: resource change graph, policy findings, blast radius and rollout/rollback review. Acceptance: no real apply in analysis flow.

### Workflow G — `release-readiness`

Input: all observed evidence, reviewed plan, role approvals. Output: `NO_GO`, `REVIEW_REQUIRED`, or future `GO_CANDIDATE` with explicit traceability and human signoff. Acceptance: no misleading green status with missing critical tests.

### Workflow H — `migration-passport`

Input: versions, changes, tests, tool/OS data, source hashes and approvals. Output: portable, privacy-filtered bundle with reproducibility instructions and integrity manifest. Acceptance: reproducible on fixture, secrets absent, missing evidence described.

### Workflow I — `cross-ide-adapter-verification`

Input: exact IDE version, OS, skills folder and permissions. Output: per-host load/invoke/callback logs and compatibility status. Acceptance: a copied skill is marked only “installed” until host discovery and actual execution are demonstrated.

---

## 19. Quality assurance strategy

Use layered tests: pure unit tests for rules and parsers; property/fuzz tests for untrusted manifests and paths; integration tests for the CLI; safe filesystem tests for symlinks, traversal and stale snapshots; mocked protocol/adapter tests; and end-to-end smoke tests on shipped fixtures.

Run `npm test` and `npm run demo` on the active environment. Configure GitHub Actions for Linux, Windows and macOS, Node.js 22 and current supported LTS. Do not claim those platforms are tested until real CI results exist. For each external adapter, maintain a compatibility matrix of tool version, OS, runtime, test fixture, known limitations and observed results.

Quality must include stable JSON schema contracts, deterministic output excluding timestamps, exact status codes, idempotency, safe report rendering, cancellation, timeouts, backpressure, corrupted evidence, permission denial and concurrency. Test source tree immutability before and after dry-run operations. Required coverage should be risk-based, not a decorative percentage.

For open-source readiness, provide example migration cases, machine-readable evidence, security disclosure guidance, issue templates, license scan, release notes, contribution walkthrough and a verified clean-checkout quickstart.

---

## 20. Phased engineering delivery plan

| Phase | Real deliverable | Done only when |
| --- | --- | --- |
| **P0: foundation** | Verified existing Node starter, 20 skills, architecture and threat model | Current tests and demo pass; status honest |
| **P1: parser accuracy** | Better semver and package manager adapters, evidence schemas, sensitivity rules | Fuzzed parsers and compatibility fixtures pass |
| **P2: version intelligence** | Vendor release-note adapters and version constraints, with no-key offline fallback | Tool references and tested source versions recorded |
| **P3: recipe engine** | Versioned recipe registry, applicability tests and transformation previews | Idempotency and no-source-write tests pass |
| **P4: sandbox runner** | Optional isolated, bounded code/test execution in disposable environments | Verified containment, timeout/egress restrictions and audit logs |
| **P5: codemod adapters** | OpenRewrite and jscodeshift workflows on sample repositories | Both tests and source-level diff verification pass |
| **P6: data migration lab** | One database engine and safe backup/restore rehearsal | Actual restore, checksum and rollback evidence exists |
| **P7: contract/infra** | API contract and sanitized OpenTofu plan review adapters | Exact fixture changes yield traceable findings |
| **P8: evidence gate** | Trustworthy Migration Passport and human-reviewed release gate | Missing tests cannot produce go status |
| **P9: IDE coverage** | Claude, Cursor and Codex first; then Gemini and Copilot | Actual per-host discovery and usage tested |
| **P10: server and UX** | Authenticated self-hosted service + FlightDeck | Security, privacy, RBAC, accessibility and load tested |
| **P11: publishing** | Public release, sample playbooks, contributor workflow | Availability, licensing, CI and audit review complete |

Prioritize **one meaningful vertical slice at a time**. The repository should always remain runnable after each milestone. Each phase must update `docs/STATUS.md` and `ROADMAP.md` with implemented, verified, experimental, unsupported and planned statuses.

---

## 21. Required implementation behavior from Claude

1. Run the current suite and show a concise factual baseline: command, test count, failures and environment.
2. Build a dependency map and threat model for the *next selected milestone*, not an unbounded redesign.
3. Reuse or refactor existing source with small, reviewable changes; avoid mass renames and unnecessary dependencies.
4. Write the tests that expose the missing capability, including negative/security fixtures.
5. Implement functioning code with strict input validation, no implicit shell or network operations and versioned output contracts.
6. Execute tests and inspect generated reports for safety and accuracy. Run `npm run demo` again after changes.
7. Update the exact user instructions and examples. Correct unsupported claims.
8. List the actual files changed, tests run, what was not tested, and known risks. Never promise a background build or untested release.
9. Continue to the next viable milestone in the session as permissions allow.
10. Ask the user only for genuinely needed authorization (global installs, cloud credentials, production access, data snapshots, paid API) or critical missing target requirements. Never treat silence as approval.

**Global installation policy:** Inspect the existing Claude Code/Cursor/Codex/Gemini/Copilot skills and MCP servers first. Prefer project-level installations. Before global changes, present exact tool, upstream, license, expected permissions, security implications, rollback procedure and reason; obtain explicit user consent.

**Network policy:** Pure local operations should have no network dependency. Never make unsolicited requests to private repositories, cloud consoles, infrastructure, package registries or model providers. Opt-in vendor documentation fetching is allowed only after authorization and provenance checks. No tracking or background telemetry without opt-in.

**Ownership and contribution policy:** Preserve proper attribution to Vatsal Shah as the initial creator without erasing community contributions or claiming ownership of third-party libraries. Maintain a professional contributor-friendly repo with public license and reproducible examples.

**Publication quality:** The README must explain installation, supported commands, example fixtures, actual test coverage, known limitations, support matrix, license, security reporting and maintainer obligations. A polished project is one that a stranger can operate successfully without your assistance.

---

## 22. Final release-acceptance conditions and anti-goals

**Project is ready for a public v1.0 only after:**

- At least one complete migration flow handles a real, safe target ecosystem and produces independently verified behavioral results.
- Actual undo/recovery evidence exists for any stateful scenario claimed reversible.
- Cross-platform CI has passed in real runners for declared supported systems.
- A concrete host compatibility test suite supports any claimed IDE integrations.
- Local no-key operation, security boundaries, tests, docs and contributor experience are proven.
- External tool versions, source licenses and governance are reviewed.
- Name, GitHub/package namespace and trademark checks have been completed by the maintainer.
- Human approval and risk disclosure are clear at every destructive or production-adjacent boundary.

**Explicit anti-goals:** Do not make undocumented production changes; do not run migrations on live databases automatically; do not scrape IDE credentials or private chat histories; do not bypass subscription/API access; do not generate fake benchmarks or screenshots; do not claim universal framework support; do not automatically publish PRs or social posts; do not use fabricated sources to give the appearance of verified compatibility.

**Start now:** inspect the existing `migrasutra/` starter, run its tests, then implement the next verified, safe improvement. Your first tangible milestone should improve source scanner accuracy or testable version intelligence while preserving offline operation. Report actual results, not intentions.

---

## 23. Reference resources for implementation (verify at use time)

- Agent Skills: https://agentskills.io/specification
- Claude plugins: https://github.com/anthropics/claude-plugins-official
- Cursor skills: https://cursor.com/help/customization/skills
- OpenRewrite: https://docs.openrewrite.org/
- Renovate: https://docs.renovatebot.com/
- jscodeshift: https://github.com/meta/jscodeshift
- Testcontainers: https://testcontainers.com/
- Flyway and undo caveats: https://documentation.red-gate.com/flyway/flyway-concepts/migrations/undo-migrations
- Alembic: https://alembic.sqlalchemy.org/en/latest/
- OpenTofu machine-readable plan: https://opentofu.org/docs/internals/json-format/
- .NET modernization: https://learn.microsoft.com/en-us/dotnet/core/porting/libraries
- GitHub Actions: https://docs.github.com/en/actions
- OpenTelemetry: https://opentelemetry.io/
- Gitleaks: https://github.com/gitleaks/gitleaks
- OSV-Scanner: https://github.com/google/osv-scanner

**End of master specification.**
