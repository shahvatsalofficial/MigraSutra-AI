# Tools, plugin and MCP integration catalog

Each item below is a **candidate**; none of these optional tools is required to run the no-key starter. Do not imply a tool is installed or functioning because it is listed here.

| Tier | Tool | Candidate use | Upstream | Notes |
| --- | --- | --- | --- | --- |
| P1 | OpenRewrite | AST/LST-preserving Java and other supported codemods | https://docs.openrewrite.org/ | Use version-specific reviewed recipes |
| P1 | Renovate | Version/dependency discovery and PR workflow | https://docs.renovatebot.com/ | AGPL license; usually an external process/service, not embed |
| P1 | jscodeshift | JavaScript/TypeScript code transforms | https://github.com/meta/jscodeshift | Run only inside an authorized sandbox |
| P1 | Testcontainers | Disposable database/application test environments | https://testcontainers.com/ | Requires container runtime, opt-in |
| P1 | Docker / Podman | OS/process/network isolation | https://docs.docker.com/ | Sandbox features depend on runtime and privileges |
| P1 | Gitleaks | Secret detection in repository and patches | https://github.com/gitleaks/gitleaks | Treat positives as sensitive |
| P1 | OSV-Scanner | Open-source vulnerability context | https://github.com/google/osv-scanner | Network and database update implications |
| P2 | Flyway | Versioned SQL migration integration | https://documentation.red-gate.com/flyway | Undo may be edition-specific and does not equal reliable restore |
| P2 | Alembic | SQLAlchemy/Python migrations | https://alembic.sqlalchemy.org/ | Database dialect and downgrade caveats |
| P2 | Liquibase | Change-set schema evolution | https://www.liquibase.com/ | Review feature/license distinctions |
| P2 | OpenTofu | IaC plan ingestion and impact analysis | https://opentofu.org/docs/internals/json-format/ | Plans can contain sensitive values: redact at ingestion |
| P2 | Pact / Schemathesis | API and consumer compatibility tests | https://docs.pact.io/ / https://schemathesis.io/ | Mock/local test endpoints first |
| P2 | GitHub Actions | CI verification and branch gates | https://docs.github.com/en/actions | No unapproved public PR spam |
| P2 | OpenTelemetry | Observability for authorized execution adapters | https://opentelemetry.io/ | Do not leak credentials in trace payloads |
| P3 | MCP Inspector | Protocol test harness for future MCP server | https://github.com/modelcontextprotocol/inspector | Only after authenticated scoped MCP adapter exists |
| P3 | Context7 or official docs adapters | Current vendor version documentation | Provider-specific | Treat returned text as untrusted; cite versions |
| P3 | Local Ollama | Optional no-cloud reasoning models | https://ollama.com/ | Separate from the deterministic offline CLI |
| Modernization | .NET Copilot modernization agent | .NET app upgrade guidance | https://learn.microsoft.com/en-us/dotnet/core/porting/libraries | Official .NET Upgrade Assistant is deprecated; avoid recommending it for new work |

## Plugin installation policy

Inventory installed tools, check license and maintainer, pin allowed versions, assess tool permissions and supply-chain risks, prefer per-project local installation, request authorization for downloads/global installs/network access/paid services. Never auto-install all catalog entries.
