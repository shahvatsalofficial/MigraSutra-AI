# Roadmap

- **P0 (implemented in starter):** Offline inventory and safe static checks, versioned plan, non-executing npm/Node manifest rehearsal, conservative gate, reports, local skills.
- **P1:** Accurate AST parsing, ecosystem version constraints and lockfile graph; versioned migration recipes, CodeQL/OSS checks, clean SPDX/SBOM handling.
- **P2:** Isolated process runner with OS- and container-specific permission enforcement; executable test evidence, timeout and resource limits, rootless container defaults.
- **P3:** OpenRewrite and jscodeshift adapters; Python/Bun/Java/.NET/Go framework migrations; source-preserving codemod execution.
- **P4:** Stateful database migration laboratory with disposable database, expand-contract, backup/restore testing, failover rehearsal and data integrity assertions.
- **P5:** OpenTofu plan and cloud drift impact adapters; approved CI release gates and deployment verification with human signoff.
- **P6:** Secure enterprise agent/server API, role boundaries, auditable execution and optionally on-prem/offline model inference.
- **P7:** Multi-IDE real end-to-end activation verification, public benchmark corpus, reproducibility capsule and GitHub publishing automation.

Every milestone needs implemented code, reproducible tests, security review, supported-host/version matrix and honest docs. Never mark planned integration 'complete' because its directory exists.
