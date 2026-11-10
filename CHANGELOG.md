# Changelog

## 0.2.0 — 2026-11-11

- Added `audit` command: scan, plan, static rehearsal and gate in one step, written as `audit.json`, `audit.md` and `audit.html`.
- Rebuilt Markdown and HTML reports: severity table, badges, dark mode, responsive layout, escaped output.
- Added `--fail high` exit gate for CI, `version` command and `compareVersions`.
- New SQL rules: `SQL_NOT_NULL_NO_DEFAULT`, `SQL_RENAME`, `SQL_INDEX_NOT_CONCURRENT`. Go and PHP manifest inventory.
- Fixed CI failures: symlink tests no longer fail on hosts that forbid symlink creation (they skip with a reason).
- Added labelled SQL corpus tests (16 cases), audit tests and CLI tests (99 tests total).
- Added `documents/MigraSutra-AI/` (Markdown and HTML), observed test evidence, sample audit reports, `llms.txt`, NOTICE, CITATION and SUPPORT.
- Package is now publishable (metadata, `files`, provenance workflow). Version bumped to 0.2.0.

## 0.1.0 — 2026-11-11

- First offline MigraSutra starter: safe repository inventory, static migration findings, npm/Node migration plans, disposable static rehearsal, conservative gate, comparison and reports.
- 20 portable Agent Skills and matching Claude subagent instruction files.
- Local skills installation, documentation, fixtures, CI, and authenticated local read-only server.

This is an experimental starter, not a production migration orchestrator.
