# Module: REFACTORING

**SmartRouter signal keyword**: `module:refactor`
**Responsibility**: Improve code structure, readability, and maintainability without changing observable behavior.

---

## Routing Signals

```
Primary   (+3): refactor, restructure, rewrite, "clean up", simplify, extract,
                modernize, decouple, reorganize, "split out"
Secondary (+1): improve, better, messy, duplicate, redundant, organize, tidy,
                split, merge, consolidate
Negative  (-2): bug, "new feature", test, document, fix, error
```

---

## Behavior Protocol

1. **Behavior Lock** — Confirm and record current behavior before touching a line. Every refactoring pass must preserve it in full.
2. **Smell Identification** — Audit the code for specific smells before starting: duplication, overly long functions, deep nesting, magic strings/numbers, unclear naming, inconsistent patterns.
3. **Incremental Steps** — Refactor in small, reviewable steps. Do not rewrite an entire file in one pass — split it into logical increments.
4. **Pattern Consistency** — Align refactored code with the dominant patterns in the project (Alpine.js app shapes, component structure, localStorage conventions).
5. **No Scope Creep** — Do not fix bugs or add features during a refactoring pass. If you encounter a bug, flag it separately but do not fix it inline.
6. **Before/After Summary** — Provide a brief structural diff: what was removed, what was renamed, what was extracted.

---

## Checklist

- [ ] Current behavior documented
- [ ] Code smells identified and listed
- [ ] Behavioral equivalence preserved throughout
- [ ] Incremental changes applied (not one big rewrite)
- [ ] Code aligned with project patterns
- [ ] No bugs fixed or features added
- [ ] Before/after summary provided

---

## Code Smell Catalog (Webropol-Specific)

| Smell | Example | Suggested Fix |
|---|---|---|
| Repeated localStorage read/write boilerplate | Same try/catch block in 5 places | Extract to a shared `storage.js` utility or Alpine.js mixin |
| Alpine.js app functions exceeding ~80 lines | Large monolithic `init()` | Split into helper methods |
| Inline styles mixed with Tailwind | `style="color: #123456"` alongside `class="..."` | Convert to Tailwind token class |
| Magic numbers/strings in templates | `z-index: 9999` hardcoded in multiple places | Use CSS variable or design token |
| Redundant `x-if` and `x-show` on same element | Both conditions guard the same block | Consolidate into one directive |
| Copy-pasted Alpine.js data objects | Same `items`, `loading`, `selectedTab` pattern duplicated | Abstract to a shared composable or base pattern |
| Import paths inconsistent | Some `../../design-system/...`, some `../design-system/...` | Normalize to correct relative depth for page location |

---

## Example Prompts That Route Here

- "This Alpine.js app function is getting too long — can you clean it up?"
- "There's a lot of duplicated localStorage code across the survey pages"
- "The modal logic is tangled with the form logic — split them out"
- "Simplify this deeply nested template condition"
- "Consolidate these three nearly-identical card components"

---

## Refactoring Does NOT Include

- Fixing bugs found during cleanup (flag them, don't fix inline)
- Adding error handling that wasn't there before (unless it was a missing pattern)
- Upgrading or changing dependencies
- Changing visual output or user-facing behavior

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
