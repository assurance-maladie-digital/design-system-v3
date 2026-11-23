---
name: review
description: "Use when reviewing code, pull requests, diffs, or changes in this repository. Provides Synapse review criteria for correctness, scope, Vue patterns, tests, accessibility, and public library compatibility."
---

# Synapse Code Review

Review changes from a factual, user-impact perspective. Report findings first, ordered by severity, and ground every finding in the changed code or a verified behavior. Do not present assumptions as facts.

## Review Workflow

1. Understand the intended change and inspect the relevant diff, implementation, and focused tests.
2. Verify the behavior rather than relying on the author’s description.
3. Check existing components, composables, directives, and utilities before recommending new duplicated logic.
4. Report only actionable regressions, risks, or missing coverage. Do not request unrelated refactors.

## Review Criteria

### Scope and maintainability

- The change is minimal and addresses the root cause rather than a downstream symptom.
- The implementation follows existing project naming, structure, and patterns.
- New files are integrated through the required exports, build entry points, or documentation; no orphaned files remain.
- No dead code, `console.log`, `debugger`, temporary comments, or unreachable branches are introduced.
- New dependencies have a clear justification and do not duplicate a local utility or composable.

### Vue state and reactivity

- State stays as close as possible to the component that uses it.
- Each state value has a single source of truth and a single mutation owner; it is lifted or shared only when several consumers genuinely need it.
- Derived values use `computed`; watchers are reserved for side effects.
- The change does not introduce cascading watchers, synchronization flags, arbitrary timers, or direct DOM access where Vue props, emits, models, refs, or directives provide the appropriate mechanism.
- Reusable, stateful, or side-effect-heavy logic belongs in a focused, typed composable.

### API and security

- Public props, emits, slots, exports, and types remain backward-compatible, or the breaking change is explicit and documented.
- Any contract change (props, emits, slots, exports, observable behavior) is documented in its own file under `dev/ReleasesAlerts/vX.X.X/<Component>/` before the PR is completed (see `dev/ReleasesAlerts/README.md`); its absence on a contract-changing PR is a finding.
- New public props are typed, documented, and represented in stories.
- New code does not introduce `any`; type assertions are limited to justified interoperability cases.
- User-controlled content is not rendered with `v-html` unless it is static or demonstrably sanitized, and inputs are validated before entering component state.

### Testing

- Each bug fix has a regression test that reproduces the failure through public behavior.
- Tests exercise props, slots, user interactions, rendered DOM, and emitted events rather than internal component state.
- Visual changes are manually checked before baseline updates; visual baselines generated under WSL must not be committed.

### Accessibility

The review checks **the same checklists** the author had to satisfy. For any diff touching markup, styles, interactions or a11y tests, load the matching skills and verify each item of their « Critères vérifiables » section:

| Diff touches | Skill |
|---|---|
| Interactive markup, ARIA, keyboard, focus, overlays | `a11y-aria-patterns` |
| Icons, buttons, labels, error messages, `locales`, `ignoreRules` | `a11y-fixes` |
| `*.a11y.spec.ts`, keyboard/focus tests, new or changed component | `a11y-testing` |
| Colours, opacity, outlines, SCSS, theme tokens | `a11y-contrast` |

- Each unmet criterion is a finding; tie it to its RGAA 4.1.2 criterion using the `rgaa` skill (e.g. `RGAA 11.10`).
- A rule added to `ignoreRules` without a justifying comment, or a wait added before `axe` only to make it pass, is at least `high`.
- Known Tanaguru false positives (`doc/Accessibilite/README.md` §5) are not findings.

## Findings Format

For every finding, state:

- Severity: `critical`, `high`, `medium`, or `low`.
- Exact file and line.
- The observable consequence.
- The smallest practical correction.

When invoking framework, Vuetify, RGAA, or Vue guidance, cite the relevant official documentation, issue, or project documentation. If no issues are found, say so and mention any remaining test gaps or residual risk.
