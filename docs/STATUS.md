# Implementation status — 2026-11-11

## Implemented and tested locally

- Bounded manifest/SQL/Docker scanning (read-only), deterministic evidence IDs, SHA-256 source hashes.
- Basic static detection of potentially destructive SQL, unpinned Python/npm/Docker dependencies and manifest parse problems.
- npm package version and Node engine migration plan generation based on a current scan.
- Rehearsal of a manifest-field update in an ephemeral temporary directory, with source baseline verification and without executing application code.
- Conservative release gate (`REVIEW_REQUIRED` or `NO_GO`); imported test evidence remains unverified by default.
- JSON/Markdown/HTML reports, scan comparison, CLI entrypoint and 127.0.0.1 read-only authenticated report service.
- Copy-only project-local installation of portable skills into five host-specific directories.
- Source documentation, 20 skill definitions and matching Claude subagent instructions.

## Not yet implemented

- Live dependency resolution, CVE lookup, supported upgrade matrix data and authenticated vendor research.
- Running arbitrary test suites, full codemods, framework migrations, SQL migration execution or actual rollback restoration.
- Real isolated process/container runtime, test-attested `GO` decisions, cross-host native adapter verification.
- Hosted server, multi-tenant users, RBAC, production deployments or an interactive dashboard.

## Accuracy note

The CLI's `rehearse` command is a **static manifest rehearsal**. It cannot certify an application upgrade. A `REVIEW_REQUIRED` recommendation for a clean fixture is expected because no application or rollback tests were run.
