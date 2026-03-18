# Module: FEATURE_ARCHITECTURE

**SmartRouter signal keyword**: `module:feature`
**Responsibility**: Design and build new features, pages, components, or system integrations from the ground up.

---

## Routing Signals

```
Primary   (+3): create, build, implement, "add feature", scaffold, "new component",
                "new page", foundation, architecture, "from scratch", integrate,
                "set up", "wire up", "build out"
Secondary (+1): new, want, need, layout, module, extend, design, structure, page, component
Negative  (-2): fix, bug, error, broken, test, "not working", refactor, document, explain
```

---

## Behavior Protocol

1. **Design System Check** — Before writing code, verify whether existing `webropol-*` components cover the requirement. List what can be reused.
2. **Architecture First** — Define component/page structure, Alpine.js app shape, and localStorage key names before touching any files.
3. **Pattern Matching** — Scan sibling files (same folder or adjacent module) to match naming conventions, import depths (`../`), and Alpine.js function naming.
4. **Component Decision** — If no suitable design system component exists, present a `create-component` decision to the user before proceeding.
5. **Minimal Scope** — Implement only what was requested. No speculative helpers or future-ready abstractions.
6. **Integration Validation** — After implementation: verify import paths, sidebar `active` attribute, `base` attribute path depth, and breadcrumb `trail` JSON array.

---

## Checklist

- [ ] Existing `webropol-*` components checked
- [ ] Structure/architecture defined before coding
- [ ] Sibling file patterns matched
- [ ] Component decision made (reuse or create new)
- [ ] Implementation complete and minimal
- [ ] Import paths and navigation attributes verified

---

## Example Prompts That Route Here

- "Create a new reports page for the events module"
- "Build a modal for exporting survey results"
- "Scaffold a settings page for admin users"
- "Add a progress stepper component to the create flow"
- "Implement the survey share panel from scratch"
- "Set up a new Alpine.js app for the billing section"

---

## Webropol-Specific Patterns to Follow

### New Page Template (one level deep)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://kit.fontawesome.com/50ef2d3cf8.js" crossorigin="anonymous"></script>
  <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'webropol-primary': { 50:'#f0fdff', 500:'#06b6d4', 700:'#0e7490', 900:'#164e63' },
            'webropol-gray': { 50:'#f8fafc', 500:'#64748b', 900:'#0f172a' }
          },
          fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
        }
      }
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="../design-system/components/navigation/Sidebar.js" type="module"></script>
  <script src="../design-system/components/navigation/Header.js" type="module"></script>
  <script src="../design-system/components/navigation/Breadcrumbs.js" type="module"></script>
  <script src="../design-system/components/interactive/FloatingButton.js" type="module"></script>
</head>
<body x-data="moduleApp()">
  <div class="flex h-screen">
    <webropol-sidebar active="[module]" base="../"></webropol-sidebar>
    <div class="flex-1 flex flex-col overflow-hidden">
      <webropol-header username="User" show-notifications show-help show-user-menu show-theme-selector></webropol-header>
      <div class="bg-white/70 backdrop-blur px-0 sm:px-4">
        <webropol-breadcrumbs trail='[{"label":"Home","url":"../index.html"},{"label":"Module"}]'></webropol-breadcrumbs>
      </div>
      <main class="flex-1 overflow-y-auto px-6 py-12" role="main">
        <!-- Feature content here -->
      </main>
    </div>
  </div>
</body>
</html>
```

### Alpine.js App Shape
```javascript
function moduleApp() {
  return {
    items: [],
    loading: false,

    init() {
      this.loadFromLocalStorage();
    },

    loadFromLocalStorage() {
      try {
        const data = localStorage.getItem('webropol_module_data');
        this.items = data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('localStorage read error:', e);
        this.items = [];
      }
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('webropol_module_data', JSON.stringify(this.items));
      } catch (e) {
        console.error('localStorage write error:', e);
      }
    }
  }
}
```

---

## Output Format

Provide:
1. File(s) created or modified with path
2. Checklist completed above
3. SmartRouter footer

---

*Reference card for SmartRouter — see `SmartRouter.agent.md` for full routing logic.*
