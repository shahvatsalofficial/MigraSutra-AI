# Security policy

**MigraSutra is a migration auditing tool, not an authorization to make production changes.**

Supported security scope in the starter: bounded read-only scanning; opt-in report-file writes; no arbitrary application command execution; symlink refusal for read inputs; temporary-directory-only manifest transform; localhost report service with bearer token; strict no overwrite for installed skills.

Known limitations: SQL parsing is heuristic, not a dialect-complete SQL parser. Manifest version analysis is not live vulnerability resolution. Process sandboxing, verified remote authentication and multi-tenant hosting are not implemented. Reports may disclose dependency names and path structure. Do not use on untrusted projects with filesystem manipulation concurrent to scanning; TOCTOU hardening is roadmap work.

Please report vulnerabilities privately through GitHub Security Advisories on https://github.com/shahvatsalofficial/MigraSutra-AI/security/advisories/new. Do **not** post live tokens or exploit steps in public issues.

Supported version: the latest 0.x release. This is a volunteer project with no response-time guarantee.
