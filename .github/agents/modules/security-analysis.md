# Module: SECURITY_ANALYSIS

**SmartRouter signal keyword**: `module:security`
**Responsibility**: Identify and fix security vulnerabilities with a focus on OWASP Top 10 in this frontend codebase.

---

## Routing Signals

```
Primary   (+3): security, vulnerability, injection, xss, csrf, auth, permission,
                owasp, exploit, sanitize, "access control", insecure
Secondary (+1): unsafe, "validate input", malicious, attack, exposure, leak,
                "sensitive data", "user input", "innerHTML"
Negative  (-2): style, layout, color, font, animation
```

---

## Behavior Protocol

1. **OWASP Scan** — Systematically check for all 10 OWASP categories relevant to the code (see table below).
2. **Input Validation Audit** — Flag any user input that reaches the DOM (`innerHTML`, `insertAdjacentHTML`), localStorage, `eval()`, or dynamic script/URL construction without sanitization.
3. **localStorage Review** — Flag sensitive data stored in localStorage without justification. LocalStorage is readable by all scripts on the page — treat it as non-confidential.
4. **Severity Rating** — Rate each finding: `Critical` / `High` / `Medium` / `Low`.
5. **Fix with Explanation** — Apply the fix AND explain why the vulnerability exists, so it is not reintroduced.
6. **No False Security** — Do not add validate calls or encoding that do not actually prevent the attack. Every check must have a clear threat model.

---

## Checklist

- [ ] All OWASP categories relevant to this code reviewed
- [ ] All user inputs traced to their outputs
- [ ] localStorage contents audited
- [ ] innerHTML/insertAdjacentHTML uses checked
- [ ] Each finding rated by severity
- [ ] Fixes applied with explanations

---

## OWASP Top 10 Checklist (Frontend Scope)

| # | Category | Relevant Check for This Codebase |
|---|---|---|
| A01 | Broken Access Control | Are admin pages protected? Does the UI hide sensitive items based on role? |
| A02 | Cryptographic Failures | Is sensitive data stored in localStorage without justification? |
| A03 | Injection | Is user input used in `innerHTML`, `eval()`, or URL construction unsanitized? |
| A04 | Insecure Design | Are security decisions baked into the design (e.g., client-side-only auth)? |
| A05 | Security Misconfiguration | Are unnecessary permissions or features exposed? |
| A06 | Vulnerable Components | Are CDN-loaded libraries (Alpine.js, Tailwind) pinned to safe versions? |
| A07 | Auth Failures | Is the auth state stored and validated securely? Is session data protected? |
| A08 | Data Integrity Failures | Is data from localStorage validated before use in the DOM? |
| A09 | Security Logging Failures | Are suspicious actions (failed auth, invalid data) silent? |
| A10 | SSRF | Are URLs constructed from user input and used in fetch() without validation? |

---

## High-Risk Patterns in This Codebase

```javascript
// DANGEROUS — XSS via innerHTML
element.innerHTML = userInput;

// SAFE — use textContent for plain text
element.textContent = userInput;

// DANGEROUS — dynamic script from user data
const url = `https://api.example.com/${userInput}`;
fetch(url);

// SAFE — validate and allowlist before use
const allowedIds = ['survey', 'event', 'report'];
if (!allowedIds.includes(userInput)) throw new Error('Invalid ID');
const url = `https://api.example.com/${userInput}`;

// DANGEROUS — sensitive data in localStorage
localStorage.setItem('webropol_auth_token', token);

// SAFE — auth tokens belong in httpOnly cookies (server-side), not localStorage
// For this frontend-only project: never store tokens, passwords, or PII in localStorage
```

---

## Example Prompts That Route Here

- "Is there an XSS risk in the way I'm rendering survey titles?"
- "Check this form for injection vulnerabilities"
- "Review the do-not-contact page for access control issues"
- "Is it safe to store user email in localStorage?"
- "Audit the AI input handling for prompt injection risks"
- "Does this URL construction create an SSRF vulnerability?"

---

## Severity Guide

| Level | Description | Action |
|---|---|---|
| Critical | Direct exploitation possible, data loss or takeover risk | Fix immediately, block release |
| High | Likely exploitation with moderate effort | Fix before next release |
| Medium | Exploitation requires specific conditions | Fix within sprint |
| Low | Defense in depth finding, minimal real-world impact | Fix when convenient |

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
