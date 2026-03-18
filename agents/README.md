# Agents

This folder is a workspace-level placeholder. The active VS Code agent definitions for this project live in:

```
.github/agents/
```

## What's In `.github/agents/`

| File / Folder | Purpose |
|---|---|
| `SmartRouter.agent.md` | Intelligent routing agent — classifies intent and delegates to specialized modules |
| `AliMetaVerse.agent.md` | Two-phase plan-then-execute agent for Webropol-specific tasks |
| `PLAN-ARTIFACT-TEMPLATE.md` | Template for structured task plan files |
| `modules/` | Reference cards for each SmartRouter module |
| `logs/routing-log.md` | Auto-maintained log of SmartRouter routing decisions |
| `plans/` | Task plan artifacts created by agents |

## SmartRouter Modules

| Module | Trigger Keywords | Force-Route |
|---|---|---|
| FEATURE_ARCHITECTURE | create, build, scaffold, implement | `module:feature` |
| BUG_DIAGNOSIS | bug, fix, error, broken, not working | `module:bug` |
| REFACTORING | refactor, clean up, simplify, restructure | `module:refactor` |
| DOCUMENTATION | document, explain, readme, guide | `module:docs` |
| TESTING_VALIDATION | test, validate, verify, coverage | `module:test` |
| SECURITY_ANALYSIS | security, xss, injection, owasp | `module:security` |
| PERFORMANCE | slow, memory leak, optimize, bottleneck | `module:perf` |
| GENERAL_FALLBACK | (fallback for ambiguous prompts) | `module:fallback` |

## Using SmartRouter

Open GitHub Copilot Chat and type `@SmartRouter` followed by your request. The agent will automatically classify your intent and apply the most appropriate module.

To force a specific module:
```
@SmartRouter module:bug The sidebar active state breaks after navigation
```
