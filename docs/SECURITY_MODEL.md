# Security model and threat considerations

**Assets:** source repository, secrets, database state, CI credentials, deployment environment, package supply chain and report integrity.

**Threats:** prompt injection from package metadata and vendor changelogs; symlink/path traversal; malicious npm install scripts; compromised codemods; SQL data loss; untrusted container images; unauthorized remote execution; stale/forged evidence; leaked report artifacts; privilege escalation; replayed approval tokens.

**Starter mitigations:** bounded reading of selected files, no general source/document crawl, exclusion of `.env` and vendor directories, rejection of symlinks for read paths, no child process execution, explicit output-file writes, isolated manifest transform, local-only authenticated report serving and non-overwrite skill installation.

**Known gaps:** TOCTOU filesystem races, full SQL/semver parsers, artifact signing, code sandbox, per-request rate limits, robust audit retention and multi-tenant isolation. Never market the starter as secure for hostile multi-user hosting.

**Future requirements:** pinned tool versions and provenance, real container/resource isolation, read-only mounts, network egress policy, scoped credentials, SBOM, secret scans, data classification, immutable execution logs, backup restore tests and manual approval before production changes.
