# SmartRouter — Module Reference Cards

Each file in this directory is a **module reference card** for the SmartRouter agent. The SmartRouter embeds all routing logic and module protocols directly in `SmartRouter.agent.md`. These cards serve as:

- Quick human reference for understanding each module's scope
- Extension templates when adding new modules
- Input/output contract documentation

---

## Module Inventory

| Module | File | Responsibility |
|---|---|---|
| FEATURE_ARCHITECTURE | [feature-architecture.md](./feature-architecture.md) | New features, pages, components, architecture |
| BUG_DIAGNOSIS | [bug-diagnosis.md](./bug-diagnosis.md) | Bugs, errors, broken behavior, debugging |
| REFACTORING | [refactoring.md](./refactoring.md) | Code cleaning, restructuring, deduplication |
| DOCUMENTATION | [documentation.md](./documentation.md) | Readme, comments, guides, explanations |
| TESTING_VALIDATION | [testing-validation.md](./testing-validation.md) | Tests, specs, coverage, validation logic |
| SECURITY_ANALYSIS | [security-analysis.md](./security-analysis.md) | OWASP vulnerabilities, auth, input validation |
| PERFORMANCE | [performance.md](./performance.md) | Speed, memory, rendering bottlenecks |
| GENERAL_FALLBACK | [general-fallback.md](./general-fallback.md) | Ambiguous or cross-cutting requests |

---

## Shared Input/Output Contract

All modules receive a normalized context object and produce a structured result. This consistency is what enables the router to swap modules without rework.

### Input (passed by SmartRouter after Phase 0)

```json
{
  "cleanPrompt": "string — noise-stripped prompt",
  "verbs": ["string"],
  "nouns": ["string"],
  "context": {
    "filePaths": ["string"],
    "errorMessages": ["string"],
    "componentNames": ["string"],
    "lineNumbers": ["number"]
  },
  "workspaceContext": {
    "recentChanges": ["string"],
    "activePatterns": ["string"],
    "designSystemComponents": ["string"],
    "localStorageKeys": ["string"]
  }
}
```

### Output (produced by every module)

```json
{
  "module": "MODULE_NAME",
  "confidence": 85,
  "summary": "One sentence describing what was done",
  "filesTouched": ["relative/path"],
  "checklistCompleted": ["item1", "item2"],
  "blockers": [],
  "outcome": "completed | blocked | clarification-requested"
}
```

---

## Adding a New Module

1. Copy any existing module card as a template.
2. Fill in: name, responsibility, signal keywords, behavior protocol, example prompts.
3. Add the Signal Scoring entry and Module Protocol section to `SmartRouter.agent.md`.
4. Add a force-route alias (`module:<shortname>`) to the Force-Route Override section.
5. Add a row to the table above.

**Planned future modules**: `ACCESSIBILITY`, `INTERNATIONALIZATION`, `API_DESIGN`
