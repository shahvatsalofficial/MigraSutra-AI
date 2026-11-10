# Architecture

## Layers

1. **User interfaces:** Node.js CLI and localhost-only report-reader service; future dashboard and MCP tool surfaces behind authentication.
2. **Skills/adapters:** portable Agent Skills and optional IDE-specific wrappers, no host-specific tool execution in the deterministic core.
3. **Domain:** manifest inventory, version-target parser, evidence IDs, risk classification, migration planning, static rehearsal, gate and report generation.
4. **Security:** least privilege, scope/path verification, symlink rejection, file-size limits, no arbitrary commands, local-only server, token requirements.
5. **Evidence:** versioned JSON artifacts with source hashes and explicit unknown/NOT_RUN status.
6. **Persistence:** file-based local reports in starter; future optional SQLite/postgres with retention/roles, not a new dependency for local use.
7. **Integration:** OpenRewrite, Renovate, JSCodeshift, Flyway, Alembic, Testcontainers, OpenTofu, Docker, approved hosted runners.

## End-to-end data flow

`scoped repository → static scan + source SHA-256 → targeted plan → isolated static rehearsal → independent verification requirements → release review report`. Execution adapters are intentionally absent from the starter and must not be implied by the directory structure.

## Trust boundaries

- Repository files and PR descriptions are **untrusted data**.
- Plan files are user/agent-produced artifacts and must be validated and source-hash matched before use.
- Source project stays read-only unless human explicitly authorizes a separate write operation.
- Isolated rehearsal temporary files are deleted after use; report outputs are user-chosen paths.
- Future remote components require actual RBAC and cryptographic evidence integrity, not only a bearer token in source code.

## Module interfaces

`scanRepository(root) → ScanV1`; `createPlan(root, scan, target) → PlanV1`; `rehearsePlan(root, plan) → RehearsalV1`; `releaseGate(plan, rehearsal) → GateV1`; `compareScans(old,new) → CompareV1`.

## ADRs

- ADR-0001: deterministic offline-first core, no mandatory provider key.
- ADR-0002: no arbitrary shell/code execution in starter.
- ADR-0003: conservative gate until actual verified tests and restore evidence exist.
- ADR-0004: skills format independent of any IDE; compatibility is per-host empirical.
