# Changelog

## Unreleased

- Rebuilt the documentation website: landing page, diagrams, charts, seven scenarios with real CLI output, light default with dark toggle, mobile layout.
- Added How it works and FAQ pages.
- HTML audit reports now always use the light theme.

## 0.2.1 — 2026-11-16

- Version now has a single source (`package.json`); `TOOL_VERSION` reads it, so reports and `doctor` cannot drift.
- CI and release workflows updated to `actions/checkout@v7`, `setup-node@v7`, `upload-artifact@v7` (Node 20 action runtime deprecation).
- Test asserts CITATION.cff and package version stay in sync.

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
