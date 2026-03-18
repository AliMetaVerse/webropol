# Module: DOCUMENTATION

**SmartRouter signal keyword**: `module:docs`
**Responsibility**: Generate clear, accurate documentation, inline comments, guides, and explanations.

---

## Routing Signals

```
Primary   (+3): document, readme, explain, describe, comment, annotate, guide,
                docs, "write up", specification, spec
Secondary (+1): "how does", "what is", clarify, summarize, overview, walkthrough
Negative  (-2): fix, build, create, test, refactor
```

---

## Behavior Protocol

1. **Audience Check** — Determine if docs are for end-users, developers, or both. Adjust tone (user-facing: plain language; developer-facing: technical precision).
2. **Read Before Writing** — Read every file being documented before writing a single line. Never document assumed behavior.
3. **Accuracy First** — Verify all behavior claims against source code. If something is unclear in the code, say so — don't invent a description.
4. **Format Matching** — Match the existing documentation style in the repo: heading levels, code block language tags, tone, and section ordering.
5. **No Padding** — No filler phrases ("This section describes...", "As you can see..."), no restating what is obvious from the code.
6. **Example-Driven** — Include concrete usage examples wherever they aid understanding. Prefer real patterns from the codebase over invented examples.

---

## Checklist

- [ ] Audience identified (user-facing or developer-facing)
- [ ] All source files read before writing
- [ ] All content verified against source (no guessed behavior)
- [ ] Format consistent with existing project docs
- [ ] Concrete examples included
- [ ] No padding or filler content

---

## Documentation Types Handled

| Type | Location | Notes |
|---|---|---|
| README | Root or module folder `README.md` | Overview, setup, usage |
| Component API docs | `design-system/docs/` or inline in component file | Props, events, slots, examples |
| Integration guide | `docs/` folder | How to wire up a feature end-to-end |
| Inline code comments | Inside `.js` or `.html` files | Only where logic is non-obvious |
| Plan artifacts | `.github/agents/plans/` | Structured task plans (use PLAN template) |
| Quick reference | `docs/*-QUICK-REF.md` | Short lookup tables and code snippets |

---

## Inline Comment Philosophy

Only add comments where the logic is non-obvious. Do NOT comment:
- What the code clearly reads as (e.g. `// Set loading to true` before `this.loading = true`)
- Standard Alpine.js/Tailwind patterns that any developer familiar with the stack would know

DO comment:
- Non-obvious business rules ("Surveys with draft status are excluded from the count here per product spec")
- Workarounds for browser bugs or framework gotchas
- z-index decisions (high-impact, easy to break)

---

## Style Reference (Existing Docs Format)

The project's docs follow this pattern:
- `#` for doc title, `##` for sections, `###` for subsections
- Code blocks always have a language tag (` ```html`, ` ```javascript`, ` ```json`)
- Tables for quick reference (pattern | example | notes)
- No emoji
- Backticks for inline code references

---

## Example Prompts That Route Here

- "Document the BaseComponent API for the design system"
- "Write a README for the webroai module"
- "Explain how the SPA routing works in this project"
- "Add comments to the FloatingButton component's bind events"
- "Create a quick reference card for the Tailwind token system"
- "Describe how localStorage keys are structured across modules"

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
