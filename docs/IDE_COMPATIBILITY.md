# Host/IDE compatibility

The starter copies standard `SKILL.md` folders to **project-local paths**; this is filesystem integration, not an end-to-end claim of native skill activation.

| Host | Installer target | Verified in this starter |
| --- | --- | --- |
| Claude Code | `.claude/skills/` | Copy operation and file content only |
| Cursor | `.cursor/skills/` | Copy operation and file content only |
| Codex | `.agents/skills/` | Copy operation and file content only |
| Gemini CLI | `.gemini/skills/` | Copy operation and file content only |
| GitHub Copilot | `.github/skills/` | Copy operation and file content only |
| Other hosts | `.agents/skills/` | Copy operation only |

Host-native execution, authentication, cloud-agent synchronization and platform-specific plugin scopes require separate compatible host/version testing. Agent Skills define the *skill format*, not each product's discovery and permission behavior.

## Agent behavior

Start from `skills/migrasutra-prime/SKILL.md`. Load specialists on demand. When subagent features are unavailable, follow the same sequence in one host assistant; do not silently use external model APIs.
