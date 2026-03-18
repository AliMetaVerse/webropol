# Module: TESTING_VALIDATION

**SmartRouter signal keyword**: `module:test`
**Responsibility**: Create tests, validate logic, identify edge cases, and verify coverage.

---

## Routing Signals

```
Primary   (+3): test, validate, verify, spec, coverage, "unit test", integration,
                qa, assertion, "write tests", "add tests"
Secondary (+1): check, assert, mock, expect, confirm, ensure, snapshot, "edge case"
Negative  (-2): "fix bug", "new feature", document
```

---

## Behavior Protocol

1. **Understand First** — Read and understand the implementation fully before writing any test. Never test assumed behavior.
2. **Edge Cases** — Identify and cover: empty/null/undefined input, boundary values (min/max), concurrent state transitions, invalid types, missing attributes.
3. **Test Naming** — Use the pattern: `should_[expected_behavior]_when_[condition]`.
4. **Minimal Mocking** — Mock only external dependencies (fetch, localStorage). Test real internal logic without mocking it away.
5. **Coverage Map** — After writing tests, list: (a) behaviors now covered, (b) behaviors still untested.
6. **Validation Logic** — For non-test validation tasks (form validation, data schema checks), apply defensive checks only at real system boundaries (user input, API responses). Do not add redundant guards on internal trusted data.

---

## Checklist

- [ ] Implementation fully read before writing tests
- [ ] Edge cases identified and listed
- [ ] All test names follow `should_X_when_Y` pattern
- [ ] Only external dependencies mocked
- [ ] Coverage map provided (covered and uncovered)

---

## Validation Boundary Rules (Webropol-Specific)

Validate at these boundaries only:
- **User text input** in forms before storing to localStorage
- **URL parameters** passed to pages
- **Data loaded from localStorage** if it could have been written by external means
- **Responses from AI modules** in `webroai/ai-engine.js`

Do NOT add defensive validation for:
- Internal Alpine.js reactive data that you fully control
- Results from your own synchronous function calls
- Tailwind class names (they fail silently with no security impact)

---

## localStorage Test Patterns

```javascript
// Setup: clear state before each test
beforeEach(() => {
  localStorage.clear();
});

// Test: missing key returns default
function test_should_return_empty_array_when_no_surveys_in_storage() {
  const data = localStorage.getItem('webropol_surveys');
  const result = data ? JSON.parse(data) : [];
  console.assert(Array.isArray(result) && result.length === 0, 'Expected empty array');
}

// Test: malformed JSON is handled gracefully
function test_should_return_default_when_localStorage_is_corrupted() {
  localStorage.setItem('webropol_surveys', 'INVALID_JSON{{{');
  try {
    JSON.parse(localStorage.getItem('webropol_surveys'));
    console.assert(false, 'Should have thrown');
  } catch (e) {
    // Expected — caller must handle this with try/catch
    console.assert(e instanceof SyntaxError, 'Expected SyntaxError');
  }
}
```

---

## Alpine.js Validation Patterns

Validate form inputs before storing:
```javascript
validateForm() {
  const errors = {};
  if (!this.surveyTitle.trim()) errors.title = 'Title is required';
  if (this.surveyTitle.trim().length > 200) errors.title = 'Title must be under 200 characters';
  this.errors = errors;
  return Object.keys(errors).length === 0;
},

save() {
  if (!this.validateForm()) return;
  this.saveToLocalStorage();
}
```

---

## Example Prompts That Route Here

- "Write validation logic for the survey title input"
- "Add edge case tests for the localStorage merge utility"
- "Verify the breadcrumb trail renders correctly when trail is empty"
- "Write tests for the AI engine's question generation function"
- "Add input validation to the contact form before it saves"
- "Check if the FloatingButton handles missing items attribute gracefully"

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
