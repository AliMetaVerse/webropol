# Module: GENERAL_FALLBACK

**SmartRouter signal keyword**: `module:fallback`
**Responsibility**: Handle ambiguous, multi-faceted, or cross-cutting requests that span multiple specialized modules.

---

## Activation Conditions

This module activates automatically when:
- `top_score < 4` — no strong intent signal was found
- `(top_score - second_best_score) < 1` — two modules are nearly tied
- Clarification was requested but the response is still ambiguous
- A module explicitly fails or escalates

It is also available via force-route: `module:fallback`

---

## Behavior Protocol

1. **Decompose** — Break the full request into discrete sub-tasks. Identify which specialized module applies to each sub-task.
2. **Phased Execution** — Process each sub-task using its appropriate module's behavior protocol. Label each section with the active module.
3. **Explicit Handoffs** — Show inline module labels so the user knows which methodology is being applied at each step.
4. **Coherence** — Verify sub-task outputs are consistent (no conflicting patterns, no contradictory file changes).
5. **Summarize** — End with a concise top-level summary of all work done.

---

## Checklist

- [ ] Request decomposed into labeled sub-tasks
- [ ] Appropriate module applied per sub-task (with inline label)
- [ ] Outputs checked for internal consistency
- [ ] Top-level summary provided

---

## Section Labeling Format

When operating in multi-module mode, label each sub-task section clearly:

```markdown
### [FEATURE_ARCHITECTURE] — Building the new component

... feature work ...

### [DOCUMENTATION] — Documenting the new component

... docs work ...

### Summary

Both tasks completed. The new component is at `design-system/components/...`
and its API is documented in `docs/...`.
```

---

## Routing Footer in Multi-Module Mode

When GENERAL_FALLBACK activates multiple sub-modules, the footer must list all active modules:

```
---
**[ SmartRouter ]** Module: `GENERAL_FALLBACK` → [`FEATURE_ARCHITECTURE`, `DOCUMENTATION`] | Confidence: `58%` | Reason: request spans creating a component and documenting it
```

---

## When to Escalate Out of GENERAL_FALLBACK

If during decomposition it becomes clear the request actually maps cleanly to a single module, switch to that module:

```
---
**[ SmartRouter ]** Module: `BUG_DIAGNOSIS` | Confidence: `79%` | Reason: initial ambiguity resolved — request is a targeted bug fix after clarification
```

---

## Example Prompts That Route Here

- "Review this whole page and improve it" (could be bug + refactor + docs)
- "Help me with the events module" (too vague for single module)
- "Make this better and document what I changed" (refactor + docs)
- "Create a new feature and write tests for it" (feature + testing)
- "This is broken and also needs a cleanup" (bug + refactor)
- "Can you look at the admin tools section?" (no specific intent)

---

## Clarifying Question Format

When confidence is too low to route, ask exactly ONE question:

```
To route your request accurately, one question:
[specific question about the user's primary goal]

Options if helpful:
- (a) Create something new
- (b) Fix something broken
- (c) Improve existing code
- (d) Write documentation or explanation
- (e) Something else: [describe]
```

Do not ask multiple questions at once.

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
