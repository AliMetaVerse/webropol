# SmartRouter — Routing Log

Auto-maintained by the SmartRouter agent. Each entry records a routing decision for observability and optimization.

---

## Log Format Reference

```markdown
## [YYYY-MM-DD HH:mm] — <brief prompt summary (≤12 words)>
- **Module Selected**: <MODULE_NAME>
- **Confidence**: <XX>%
- **Score Breakdown**: <top3: module:score, module:score, module:score>
- **Routing Reason**: <one sentence>
- **Files Touched**: <comma-separated paths or "none">
- **Outcome**: completed | blocked | clarification-requested | force-routed
```

---

## Module Legend

| Code | Module | Handles |
|---|---|---|
| `FEAT` | FEATURE_ARCHITECTURE | New features, pages, components |
| `BUG` | BUG_DIAGNOSIS | Bugs, errors, broken behavior |
| `REF` | REFACTORING | Code cleanup, restructuring |
| `DOCS` | DOCUMENTATION | Readme, comments, guides |
| `TEST` | TESTING_VALIDATION | Tests, specs, coverage |
| `SEC` | SECURITY_ANALYSIS | Vulnerabilities, OWASP |
| `PERF` | PERFORMANCE | Speed, memory, rendering |
| `GFB` | GENERAL_FALLBACK | Ambiguous or multi-module |

---

<!-- SmartRouter will append entries below this line -->

## [2026-03-18 14:52] — check figma mcp access
- **Module Selected**: GENERAL_FALLBACK
- **Confidence**: 53%
- **Score Breakdown**: GENERAL_FALLBACK:8, DOCUMENTATION:4, BUG_DIAGNOSIS:3
- **Routing Reason**: Prompt is an environment capability check spanning agent configuration and MCP workspace setup rather than code changes in one module.
- **Files Touched**: .github/agents/logs/routing-log.md
- **Outcome**: completed

## [2026-03-18 14:43] — make sms collect helpers non-interactive
- **Module Selected**: BUG_DIAGNOSIS
- **Confidence**: 87%
- **Score Breakdown**: BUG_DIAGNOSIS:13, FEATURE_ARCHITECTURE:1, GENERAL_FALLBACK:2
- **Routing Reason**: Prompt requests fixing current behavior in an existing page by removing unintended interactivity.
- **Files Touched**: sms/collect.html
- **Outcome**: completed
