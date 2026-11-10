# Technical Specification

## Repository layout

| Path | Role |
| --- | --- |
| `packages/core/index.mjs` | Pure analysis: scan, plan, rehearse, gate, compare, audit, render |
| `packages/cli/index.mjs` | Argument parsing, file output, skill installer |
| `packages/server/index.mjs` | Localhost bearer-token read-only report API |
| `skills/migrasutra-*/SKILL.md` | 20 portable Agent Skills |
| `agents/` | Claude-targeted subagent instructions and `manifest.json` |
| `schemas/` | JSON Schemas for scan, plan, rehearsal, gate |
| `rules/`, `policies/`, `workflows/` | Rule metadata, default policy, stage definitions |
| `fixtures/` | `clean-app`, `risky-app`, `broken-app` |
| `tests/` | `node:test` suites |
| `scripts/` | `demo`, `build-docs`, `test-report`, installers |

Runtime: Node.js 22 or newer, ES modules, zero runtime dependencies.

## Data contracts

Every artifact carries a `schema` field: `migrasutra.scan/v1`, `plan/v1`, `rehearsal/v1`, `gate/v1`, `compare/v1`, `audit/v1`. Consumers must check it before use.

Evidence ID: `MS-` plus the first 12 hex characters of SHA-256 over the rule code, file, line and subject. The same input yields the same ID on every machine.

Each finding records `sourceHash` (SHA-256 of the file), `verifiedBy: deterministic-rule` and `execution: not-run`.

## Algorithms

**Scan.** Collect the allowed root files and SQL files (depth at most 5, at most 150 files, symlinks skipped). Read each through `safeRead`, which resolves the path, checks it stays inside the root, rejects every symlink segment and rejects files over 1 MiB. Hash the content. Apply per-ecosystem rules.

**SQL.** Blank block comments, line comments and single-quoted strings while keeping newlines, so line numbers stay correct. Run regular expressions over the result. `DELETE FROM` is checked per `;`-separated statement for a `WHERE`.

**Plan.** Requires a scan whose `package.json` hash equals the current file. Finds the dependency section, refuses credential-bearing values, records `from` and `to`.

**Rehearse.** Re-checks the baseline hash, validates the action against the target, applies the edit in memory, writes it to a `0600` temp file, reads it back, deletes the temp directory, and reports both hashes.

**Gate.** Counts static high findings and rehearsal status. Hard-codes `automaticTests: NOT_RUN` and `rollbackTest: NOT_RUN`.

**Version compare.** `compareVersions` compares numeric segments, then pre-release tags, and rejects strings that fail `validVersion`.

## Input validation

- Package name: scoped or plain, characters `[A-Za-z0-9._-]`, under 200 characters.
- Version: digits with up to two dots and an optional pre-release suffix, under 100 characters.
- CLI options: lowercase letters and `-` only; each needs a value.
- Report output: HTML-escaped; Markdown table cells strip pipes and newlines.

## Local server

Binds `127.0.0.1` only. Needs `MIGRASUTRA_SERVER_TOKEN` of 16 or more characters, compared with `timingSafeEqual`. Serves `GET /health` and `GET /report`. Every other method returns 405. No file browsing, no shell.

## Performance

Reads at most 150 SQL files plus a dozen manifests, each under 1 MiB. Typical audits finish in well under a second on the fixtures. No benchmark on large monorepos has been run; do not assume it scales.

## Known limits

- SQL analysis is regular-expression based, not a dialect parser. Dollar-quoted bodies are not inspected.
- Only root-level manifests are read. Monorepo sub-packages are not discovered.
- `pom.xml`, Gradle, `pyproject.toml` and `.tool-versions` are inventoried, not parsed.
- Plan and rehearsal support only `package.json` dependency or `engines.node` edits.
- `package-lock.json` and other lockfiles are not updated by a rehearsal.
