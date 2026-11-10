# Evidence contracts

Artifacts use schema IDs `migrasutra.scan/v1`, `migrasutra.plan/v1`, `migrasutra.rehearsal/v1`, `migrasutra.gate/v1`, and `migrasutra.compare/v1`.

- Each finding contains a stable ID from rule, file, line and subject, plus evidence source SHA-256.
- Scan records only selected manifests and migration scripts; hashes prove file identity, **not** correctness of the migration.
- Plan records baseline hash, requested target, proposed action, prerequisites, verification checklist and rollback hypothesis.
- Static rehearsal records source and transformed hashes, scope and command-execution status `NOT_RUN`.
- Gate explicitly distinguishes inferred/observed/static/external evidence and never treats imported external claims as certified execution.
- Provisional codes: `REVIEW_REQUIRED`, `NO_GO`. A verified `GO` verdict is deliberately outside the starter and requires a trusted test runner and human approval workflow.

Report provenance is not digitally signed; signature enforcement and attestations are future work. Do not overstate report authenticity or security guarantees.
