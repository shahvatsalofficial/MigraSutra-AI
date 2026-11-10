# Contributing

MigraSutra AI welcomes evidence-first engineering contributions.

1. Open an issue explaining the exact use case, affected ecosystem and expected input/output contract.
2. Add a fixture showing the failure and a deterministic automated test.
3. Keep new adapters optional; do not introduce mandatory AI credentials, network access or production privileges.
4. Run `npm test` and `npm run demo`; include commands, versions, test results and relevant security notes in the PR.
5. Keep scope reviewable; document parsing limitations, false positive/negative cases, rollback assumptions and permission requests.
6. Do not submit proprietary repository content or real tokens in issues, PRs or tests.

Maintainers review contributions; contributor credit follows the Git history and Apache-2.0 terms.
