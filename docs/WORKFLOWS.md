# Repeatable workflows

1. **Discovery:** `scope → read-only inventory → source hashes → dependency/runtime risks → review`.
2. **Plan:** `target/assumptions → version prerequisites → breaking-change map → upgrade plan → sign-off`.
3. **Static rehearsal:** `read baseline hash → transform manifest in disposable temp dir → compare hashes → report no tests run`.
4. **Runtime rehearsal (future):** `approved isolated runner → baseline tests → apply reviewed recipes → tests and benchmarks → provenance and resource limits`.
5. **Data migration (future):** `backup verification → clone/snapshot → expand-contract → migration checks → integrity tests → rollback restore rehearsal`.
6. **Infrastructure (future):** `parse plan JSON → redact sensitive values → review changes and blast radius → approved dry-run → deployment plan`.
7. **Gate:** `analyze evidence → fail unsafe cases → surface missing tests → request human approval`.
8. **Incident recovery (future):** `detect failure → stop rollout → use preapproved rollback/forward-fix procedure → data integrity verification → postmortem`.

Each workflow has an accountable operator, explicit input/output contracts, status and rollback requirements. Completion means measurable evidence, not that a markdown file exists.
