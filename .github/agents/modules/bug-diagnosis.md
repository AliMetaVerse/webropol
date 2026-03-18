# Module: BUG_DIAGNOSIS

**SmartRouter signal keyword**: `module:bug`
**Responsibility**: Identify root causes of bugs and deliver the smallest fix that resolves them.

---

## Routing Signals

```
Primary   (+3): bug, fix, broken, error, "not working", debug, crash, issue, problem,
                fails, incorrect, unexpected, "console error", exception, traceback
Secondary (+1): wrong, weird, why, doesn't, cant, cannot, warning, logs, "weird behavior"
Negative  (-2): create, "new feature", refactor, document, scaffold, test
```

---

## Behavior Protocol

1. **Symptom Gathering** — If no error message/stack trace is provided, ask for it *before* diagnosing. Reading files blind without reproduction details leads to guessing.
2. **Hypothesis Formation** — List 2–3 probable root causes ranked by likelihood *before* reading files.
3. **File Tracing** — Read the affected files to confirm or eliminate each hypothesis.
4. **Root Cause Verification** — Pinpoint the exact line/pattern causing the issue before writing any fix.
5. **Minimal Fix** — Apply the smallest change that resolves the root cause. Never refactor adjacent code while fixing a bug.
6. **Regression Check** — After applying the fix, scan adjacent logic for side effects.
7. **No Symptom Patching** — Never hide or suppress an error without fixing its source.

---

## Checklist

- [ ] Symptoms and error details documented
- [ ] Root cause identified (not assumed)
- [ ] Fix is minimal and targeted
- [ ] Adjacent code checked for regressions
- [ ] No symptom masking applied

---

## Example Prompts That Route Here

- "The survey list isn't loading — getting a TypeError in the console"
- "My modal won't close after clicking the overlay"
- "The breadcrumbs show the wrong active item on page refresh"
- "TypeError: Cannot read properties of undefined — how do I fix this?"
- "The sidebar active state is broken after navigating between pages"
- "Why is the Alpine.js watcher firing twice on every change?"

---

## Common Bug Patterns in This Codebase

| Pattern | Likely Cause |
|---|---|
| Component not rendering | Missing `customElements.define()` or wrong script `type="module"` |
| Alpine.js reactive data not updating | Missing `x-data` scope, direct array mutation instead of reassignment |
| localStorage data lost on save | Destructive overwrite instead of read-merge-write |
| Modal appearing behind header | Missing `modal-open` class on `body`, header z-index not lowered |
| Import paths resolving to 404 | Wrong `../` depth for page location |
| Sidebar active state wrong | `active` attribute value not matching valid module name |
| Breadcrumbs not showing | Malformed JSON in `trail` attribute |
| Design token color not applying | Tailwind config not loaded before component renders |

---

## Diagnostic Questions to Ask User

If the bug report lacks detail, ask for:
- "What is the exact error message in the browser console?"
- "Which file and function contains the broken behavior?"
- "Does this happen only in SPA mode (`/#/path`) or also in standalone (`/path.html`)?"
- "What was the last change made before this broke?"

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
