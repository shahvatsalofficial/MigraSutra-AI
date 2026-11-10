# MigraSutra AI

> **Upgrade with evidence. Rehearse before change. Recover with confidence.**

[![CI](https://github.com/shahvatsalofficial/MigraSutra-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/shahvatsalofficial/MigraSutra-AI/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
![Node >=22](https://img.shields.io/badge/node-%3E%3D22-brightgreen)
![Dependencies: 0](https://img.shields.io/badge/runtime%20dependencies-0-success)

MigraSutra AI is an **offline, deterministic, read-only migration audit CLI** with **20 portable AI-agent skills** for Claude Code, Cursor, Codex, Gemini CLI and GitHub Copilot. It scans a repository for upgrade and database-migration risk, rehearses a manifest change in a temp directory, and writes a conservative release-gate review as **JSON, Markdown and HTML**.

It runs with no API key, no account, no network and no runtime dependencies. Created by [Vatsal Shah](https://github.com/shahvatsalofficial). Apache-2.0.

## 60-second demo

```bash
git clone https://github.com/shahvatsalofficial/MigraSutra-AI.git
cd MigraSutra-AI
node packages/cli/index.mjs audit --root fixtures/risky-app --target node:22 --out artifacts/audit
```

Open `artifacts/audit/audit.html`. Expected output:

```text
audit completed: artifacts/audit (audit.json, audit.md, audit.html)
Verdict: NO_GO (high 4, medium 4, low 0)
```

See real generated reports: [risky app HTML](documents/MigraSutra-AI/evidence/samples/audit-risky.html) · [clean app HTML](documents/MigraSutra-AI/evidence/samples/audit-clean.html) · [Markdown](documents/MigraSutra-AI/evidence/samples/audit-risky.md).

## What it finds

| Area | Rules |
| --- | --- |
| SQL migrations | Drop table/column, truncate, unscoped delete, NOT NULL without default, rename, non-concurrent index |
| npm | `*`/`latest`/git/URL dependencies, missing lockfile, invalid manifest |
| Python | Requirements not pinned with `==` |
| Docker | Base image untagged, `latest`, or not digest-pinned |
| Inventory | npm, Python, Go, PHP, JVM, `.tool-versions`, Dockerfile |

Full list with severities: [functional specification](documents/MigraSutra-AI/02-functional-spec.md).

## Commands

```bash
migrasutra audit   --root . --out report-dir [--target npm:pkg@1.2.3 | node:22] [--fail high]
migrasutra scan    --root . --out scan.json [--format json|md|html]
migrasutra plan    --root . --scan scan.json --target npm:pkg@1.2.3 --out plan.json
migrasutra rehearse --root . --plan plan.json --out rehearsal.json
migrasutra gate    --plan plan.json --rehearsal rehearsal.json --out gate.json
migrasutra compare --before a.json --after b.json --out diff.json
migrasutra skills  --host claude|cursor|codex|gemini|copilot --root .
migrasutra doctor
```

Use in CI: `npx migrasutra audit --root . --out migrasutra-report --fail high`.

## Proof, not promises

- **Tests:** [observed results](documents/MigraSutra-AI/test-results.md) are machine-written by `npm run test:report`. Windows hosts without symlink privilege skip 3 symlink tests; Linux and macOS CI run them.
- **Rule accuracy:** 16 labelled SQL cases, 15 correct, 1 documented false negative. This is a small corpus, not a benchmark.
- **Immutability:** tests compare repository bytes before and after every operation.
- **Independent-style audit:** [method, results and open limits](documents/MigraSutra-AI/07-independent-audit.md). It is a self-audit, not a third-party certificate.

## Honest limits

- It does **not** run your tests, installs, scripts or migrations. Test status is always `NOT_RUN`.
- Best verdict is `REVIEW_REQUIRED`. It never says "safe to deploy". A human decides.
- SQL checks are heuristics and miss dynamic SQL inside `$$` bodies.
- Plan and rehearsal support only an npm dependency or `engines.node` change in `package.json`.
- Runnable sandboxes, codemods, database restore labs and a hosted dashboard are **roadmap, not shipped**.
- Skills are copied into IDE folders; live discovery in each IDE has not been verified.

## Documentation

All docs exist as Markdown and responsive HTML in [`documents/MigraSutra-AI/`](documents/MigraSutra-AI/README.md): executive summary, functional spec, technical spec, architecture, user guide, security and legal, audit.

## The 20 skills

`migrasutra-prime` coordinates; specialists cover atlas, dependency-scout, version-lens, breaking-change, recipe-forge, codemod-pilot, schema-guardian, data-steward, infra-mapper, runtime-bridge, rehearsal-lab, test-witness, contract-sentinel, rollback-architect, blast-radius, evidence-ledger, release-gate, ide-bridge and security-sentinel. Catalog: [docs/AGENT_CATALOG.md](docs/AGENT_CATALOG.md).

## Security and legal

Report vulnerabilities privately via GitHub Security Advisories ([SECURITY.md](SECURITY.md)). Licensed Apache-2.0 ([LICENSE](LICENSE), [NOTICE](NOTICE)). No warranty. Third-party tool names are trademarks of their owners; no affiliation is claimed. Name and trademark clearance is the maintainer's responsibility and has not been performed.

## Related projects by the same author

ArchSutra AI, VigilSutra AI, RachnaSutra AI, PramanaSutra AI, EvalSutra AI, ProtocolSutra AI, ContextSutra AI and DocSutra AI. Each is independently useful.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Run `npm test` and `npm run check:docs` before a pull request.

<!-- keywords: database migration safety, SQL migration linter, dependency upgrade risk, release gate, rollback planning, Claude Code skills, Cursor skills, Codex skills, offline audit CLI, migration evidence -->
